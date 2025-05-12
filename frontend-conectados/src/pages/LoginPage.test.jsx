import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginPage from "./LoginPage";
import { users } from "../data/mockData";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  const mockLogin = jest.fn();

  const renderLoginPage = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  const fillForm = (email, password) => {
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: password },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el formulario y enlaces", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument(); // para el <h2>
    expect(screen.getByRole("button", { name: "Iniciar Sesión" })).toBeInTheDocument(); // para el <button>
    expect(screen.getByRole("link", { name: /regístrate aquí/i })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test("muestra error si las credenciales son incorrectas", () => {
    renderLoginPage();

    fillForm("fake@example.com", "wrongpassword");
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("redirige a /pro-dashboard si el usuario es profesional", async () => {
    const proUser = users.find((u) => u.isProfessional);
    renderLoginPage();

    fillForm(proUser.email, proUser.password);
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));
    });

    expect(mockLogin).toHaveBeenCalledWith(proUser);
    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
  });

  test("redirige a /user-dashboard si el usuario es normal", async () => {
    const normalUser = users.find((u) => !u.isProfessional);
    renderLoginPage();

    fillForm(normalUser.email, normalUser.password);
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));
    });

    expect(mockLogin).toHaveBeenCalledWith(normalUser);
    expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
  });
});
