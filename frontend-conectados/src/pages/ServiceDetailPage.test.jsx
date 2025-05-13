import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ServiceDetailPage from "./ServiceDetailPage";
import { services, users, bookings } from "../data/mockData";

// Mock useParams
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "1" }),
    useNavigate: () => jest.fn(),
  };
});

describe("ServiceDetailPage", () => {
  const mockUser = {
    id: 99,
    name: "Cliente Prueba",
    isProfessional: false,
  };

  const renderPage = (contextUser = null) => {
    return render(
      <MemoryRouter initialEntries={["/service/1"]}>
        <AuthContext.Provider value={{ user: contextUser }}>
          <Routes>
            <Route path="/service/:id" element={<ServiceDetailPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    services.length = 0;
    users.length = 0;
    bookings.length = 0;

    services.push({
      id: 1,
      title: "Reparación eléctrica",
      description: "Instalación de enchufes y luces",
      category: "Electricidad",
      providerId: 2,
      providerName: "Sofía",
      providerImage: "/sofia.jpg",
      image: "/servicio.jpg",
      price: 20000,
      rating: 4.5,
      reviews: 10,
    });

    users.push({
      id: 2,
      name: "Sofía",
      profession: "Electricista",
      availability: [0, 1, 2, 3, 4],
    });
  });

  test("muestra el loader al inicio", () => {
    renderPage();
    expect(screen.getByText(/cargando detalles/i)).toBeInTheDocument();
  });

  test("renderiza correctamente los datos del servicio", async () => {
    renderPage();
    expect(await screen.findByText("Reparación eléctrica")).toBeInTheDocument();
    expect(screen.getByText(/instalación de enchufes/i)).toBeInTheDocument();
    expect(screen.getByText(/electricidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Sofía/)).toBeInTheDocument();
  });

  test("muestra mensaje si el servicio no existe", async () => {
    services.length = 0;
    renderPage();

    expect(await screen.findByText(/servicio no encontrado/i)).toBeInTheDocument();
  });

  test("muestra modal si el usuario no está logueado", async () => {
    renderPage(null); // sin sesión

    await waitFor(() => screen.getByText("Solicitar Servicio"));
    fireEvent.click(screen.getByText("Solicitar Servicio"));

    expect(
      screen.getByText(/debes iniciar sesión para solicitar/i)
    ).toBeInTheDocument();
  });

  test("muestra errores si no se elige fecha u hora", async () => {
    renderPage(mockUser);
    await waitFor(() => screen.getByText("Solicitar Servicio"));

    fireEvent.click(screen.getByText("Solicitar Servicio"));

    expect(await screen.findByText(/selecciona una fecha/i)).toBeInTheDocument();
    expect(screen.getByText(/selecciona una hora/i)).toBeInTheDocument();
  });

  test("permite agendar servicio y muestra modal de éxito", async () => {
    renderPage(mockUser);
    await waitFor(() => screen.getByText("Solicitar Servicio"));

    // Elegir fecha y hora
    fireEvent.change(screen.getByLabelText(/fecha/i), {
      target: { value: new Date().toISOString().split("T")[0] },
    });

    fireEvent.change(screen.getByLabelText(/hora/i), {
      target: { value: "10:00" },
    });

    fireEvent.click(screen.getByText("Solicitar Servicio"));

    expect(await screen.findByText(/servicio agendado/i)).toBeInTheDocument();
    expect(bookings.length).toBe(1);
    expect(bookings[0].userId).toBe(mockUser.id);
    expect(bookings[0].serviceId).toBe(1);
  });
});
