import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  const renderWithContext = (user = null, logout = jest.fn()) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user, logout }}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  test("muestra enlaces de login y registro si no hay usuario", () => {
    renderWithContext(null);
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
    expect(screen.getByText("Ofrecer Servicios")).toBeInTheDocument();
  });

  test("muestra 'Mi Panel' y 'Cerrar Sesión' si el usuario está logueado", () => {
    const mockUser = { isProfessional: false };
    renderWithContext(mockUser);
    expect(screen.getByText("Mi Panel")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  test("dirige a /pro-dashboard si el usuario es profesional", () => {
    const mockUser = { isProfessional: true };
    renderWithContext(mockUser);
    const link = screen.getByText("Mi Panel");
    expect(link).toHaveAttribute("href", "/pro-dashboard");
  });

  test("al hacer clic en Cerrar Sesión se ejecuta logout y redirige", () => {
    const mockLogout = jest.fn();
    renderWithContext({ isProfessional: false }, mockLogout);
    fireEvent.click(screen.getByText("Cerrar Sesión"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });



  test("abre y cierra el menú móvil al hacer clic en el botón", () => {
    renderWithContext(null);
    const toggleBtn = screen.getByRole("button");
  
    fireEvent.click(toggleBtn); // abrir
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(within(mobileMenu).getByText("Iniciar Sesión")).toBeInTheDocument();
  
    fireEvent.click(toggleBtn); // cerrar
    expect(mobileMenu).not.toBeVisible(); // asegura que el menú está oculto
  });
  
});
