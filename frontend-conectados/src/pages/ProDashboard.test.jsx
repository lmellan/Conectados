import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { services, bookings } from "../data/mockData";
import ProDashboard from "./ProDashboard";

// Mock Navigate
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }) => <div>Redirected to {to}</div>,
  };
});

describe("ProDashboard", () => {
  const proUser = {
    id: 1,
    name: "Carlos Profesional",
    image: "/carlos.jpg",
    profession: "Electricista",
    isProfessional: true,
  };

  const setup = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: proUser }}>
          <ProDashboard />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    services.length = 0;
    bookings.length = 0;

    services.push({
      id: 100,
      title: "Instalación eléctrica",
      category: "Electricidad",
      price: 30000,
      providerId: proUser.id,
      image: "/electricidad.jpg",
    });

    bookings.push({
      id: 201,
      providerId: proUser.id,
      userId: 5,
      serviceId: 100,
      date: "2025-06-01",
      time: "10:00",
      status: "upcoming",
    });
  });

  test("redirige a /login si no hay usuario", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: null }}>
          <ProDashboard />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Redirected to /login")).toBeInTheDocument();
  });

  test("redirige a /user-dashboard si no es profesional", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { ...proUser, isProfessional: false } }}>
          <ProDashboard />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Redirected to /user-dashboard")).toBeInTheDocument();
  });

  test("muestra servicios del profesional", () => {
    setup();
    expect(screen.getByText("Instalación eléctrica")).toBeInTheDocument();
    expect(screen.getByText("Categoría: Electricidad")).toBeInTheDocument();
    expect(screen.getByText("$30000/hora")).toBeInTheDocument();
  });

  test("cambia a pestaña de citas programadas y muestra la cita", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Citas Programadas" }));
    expect(screen.getByText(/Usuario #5/)).toBeInTheDocument();
    expect(screen.getByText("2025-06-01")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  test("muestra modal de confirmación al eliminar un servicio", () => {
    setup();
    fireEvent.click(screen.getByText("Eliminar"));
    expect(screen.getByText("Eliminar servicio")).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que deseas eliminar el servicio/i)).toBeInTheDocument();
  });

  test("elimina un servicio al confirmar desde el modal", async () => {
    setup();
    fireEvent.click(screen.getByText("Eliminar"));
    await act(async () => {
      fireEvent.click(screen.getByText("Sí, eliminar"));
    });

    expect(screen.queryByText("Instalación eléctrica")).not.toBeInTheDocument();
  });
});
