import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ServiceDetailPage from "../pages/ServiceDetailPage";
import "@testing-library/jest-dom";

// --- Mocks de Dependencias ---

// 1. Mock de la API fetch global (consistente con los otros tests)
global.fetch = jest.fn();

// 2. Mocks de Componentes Hijos
jest.mock("../components/AvailabilityCalendar", () => {
  // eslint-disable-next-line react/display-name
  return ({ availability }) => (
    <div data-testid="availability-calendar">
      Calendario de Disponibilidad: {JSON.stringify(availability)}
    </div>
  );
});

jest.mock("../components/ConfirmationModal", () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ title, message, confirmText, onConfirm, onCancel }) => (
    <div data-testid="confirmation-modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onConfirm}>{confirmText}</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
});

// 3. Mock de react-router-dom
const mockUseParams = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
  useNavigate: () => mockUseNavigate,
  Link: (props) => <a {...props} href={props.to} />,
}));


// --- Suite de Tests para la Página de Detalles del Servicio ---
describe("Página de Detalles del Servicio (ServiceDetailPage)", () => {

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    global.fetch.mockClear();
    mockUseParams.mockReturnValue({ id: "123" }); // ID de servicio por defecto
    mockUseNavigate.mockClear();
  });

  const renderComponent = (user = null) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user, token: 'mock-token' }}>
          <ServiceDetailPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  const mockServiceData = {
    id: "123",
    nombre: "Corte de Pelo Moderno",
    descripcion: "Un corte de pelo con estilo.",
    precio: 25000,
    categoria: "Peluquería",
    foto: "/corte-pelo.jpg",
    prestador: {
      id: "prestador1",
      nombre: "Juan Peluquero",
      disponibilidad: ["Lunes", "Miércoles", "Viernes"],
      horaInicio: "09:00",
      horaFin: "17:00",
    },
  };

  test("debería mostrar el estado de carga inicialmente", () => {
    // Dejamos el mock de fetch pendiente para que se vea el estado de carga
    global.fetch.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Cargando detalles del servicio.../i)).toBeInTheDocument();
  });

  test("debería mostrar los detalles del servicio después de obtenerlos", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockServiceData });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Corte de Pelo Moderno")).toBeInTheDocument();
      expect(screen.getByText("Un corte de pelo con estilo.")).toBeInTheDocument();
      expect(screen.getByText(/\$25000/, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/\/hora/, { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Juan Peluquero")).toBeInTheDocument();
    });
  });

  test("debería mostrar 'Servicio no encontrado' si la API devuelve un error", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    renderComponent();

    expect(await screen.findByText("Servicio no encontrado")).toBeInTheDocument();
  });

  test("debería mostrar el formulario de reserva para un usuario 'BUSCADOR'", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockServiceData });
    const buscadorUser = { id: "user1", rolActivo: "BUSCADOR" };
    renderComponent(buscadorUser);

    expect(await screen.findByLabelText(/Fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hora/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Solicitar Servicio/i })).toBeInTheDocument();
  });

  test("NO debería mostrar el formulario de reserva si el usuario es un 'PRESTADOR'", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockServiceData });
    const prestadorUser = { ...mockServiceData.prestador, rolActivo: "PRESTADOR" };
    renderComponent(prestadorUser);

    await screen.findByText("Corte de Pelo Moderno"); // Esperamos a que la página cargue

    expect(screen.queryByLabelText(/Fecha/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Solicitar Servicio/i })).not.toBeInTheDocument();
  });

  test("NO debería mostrar el botón de solicitar servicio si el usuario NO está logueado", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockServiceData });
    renderComponent(null); // Sin usuario

    await screen.findByText("Corte de Pelo Moderno");

    expect(
      screen.queryByRole("button", { name: /Solicitar Servicio/i })
    ).not.toBeInTheDocument();
  });


  test("debería mostrar errores de validación si no se selecciona fecha u hora", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockServiceData });
    const buscadorUser = { id: "user1", rolActivo: "BUSCADOR" };
    renderComponent(buscadorUser);

    await screen.findByText("Corte de Pelo Moderno");

    fireEvent.click(screen.getByRole("button", { name: /Solicitar Servicio/i }));

    expect(await screen.findByText("Por favor selecciona una fecha.")).toBeInTheDocument();
    expect(screen.getByText("Por favor selecciona una hora.")).toBeInTheDocument();
    
    // Verificamos que no se intentó enviar la cita
    expect(global.fetch).toHaveBeenCalledTimes(1); // Solo la llamada para obtener el servicio
  });

  test("debería reservar un servicio exitosamente y mostrar un modal de éxito", async () => {
    // 1. Mock para obtener el servicio
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    // 2. Mock para crear la cita
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Cita creada" }) });

    const buscadorUser = { id: "user1", rolActivo: "BUSCADOR" };
    renderComponent(buscadorUser);

    await screen.findByText("Corte de Pelo Moderno");

    fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: "2025-07-20" } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: "10:00" } });
    fireEvent.click(screen.getByRole("button", { name: /Solicitar Servicio/i }));

    await waitFor(() => {
      // Verificamos que se llamó a la API para crear la cita
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/citas/crear",
        expect.objectContaining({ method: "POST" })
      );
    });

    // Verificamos que aparece el modal de éxito
    expect(await screen.findByText("¡Servicio agendado!")).toBeInTheDocument();
  });

  test("debería mostrar un error de la API si la reserva falla", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    const errorApi = "No hay disponibilidad para esa fecha/hora";
    global.fetch.mockResolvedValueOnce({ 
      ok: false, 
      status: 400,
      json: async () => ({ message: errorApi }) 
    });

    const buscadorUser = { id: "user1", rolActivo: "BUSCADOR" };
    renderComponent(buscadorUser);

    await screen.findByText("Corte de Pelo Moderno");
    
    fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: "2025-07-20" } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: "10:00" } });
    fireEvent.click(screen.getByRole("button", { name: /Solicitar Servicio/i }));

    expect(await screen.findByText(errorApi)).toBeInTheDocument();
  });
});