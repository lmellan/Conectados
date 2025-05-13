import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CreateServicePage from "./CreateServicePage";
import { services } from "../data/mockData";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreateServicePage", () => {
  const mockUser = {
    id: 1,
    name: "Pedro Profesional",
    image: "/user.jpg",
    isProfessional: true,
  };

  const renderPage = (user = mockUser) =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user }}>
          <CreateServicePage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    services.length = 0; // limpia servicios para pruebas
  });

  test("redirecciona si no hay usuario", () => {
    renderPage(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("redirecciona si el usuario no es profesional", () => {
    renderPage({ ...mockUser, isProfessional: false });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("renderiza el formulario correctamente si el usuario es profesional", () => {
    renderPage();
    expect(screen.getByText("Crear Nuevo Servicio")).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio por hora/i)).toBeInTheDocument();
  });

  test("muestra errores si se envía el formulario vacío", async () => {
    renderPage();
    const submitBtn = screen.getByRole("button", { name: /crear servicio/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("El título es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("Debes seleccionar una categoría")).toBeInTheDocument();
    expect(screen.getByText("La descripción es obligatoria")).toBeInTheDocument();
    expect(screen.getByText("El precio es obligatorio")).toBeInTheDocument();
  });

  test("envía el formulario y redirige al dashboard", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/Título del servicio/i), {
      target: { value: "Test Servicio" },
    });
    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { value: "limpieza" },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: "Descripción de prueba" },
    });
    fireEvent.change(screen.getByLabelText(/Precio por hora/i), {
      target: { value: "15000" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
      await new Promise((res) => setTimeout(res, 1100)); // espera al setTimeout simulado
    });

    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
    expect(services.length).toBe(1);
    expect(services[0].title).toBe("Test Servicio");
  });
});
