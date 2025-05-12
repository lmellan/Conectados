import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RegisterPage from "./RegisterPage";
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

describe("RegisterPage", () => {
  const mockRegister = jest.fn();

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: mockRegister }}>
          <RegisterPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  const fillForm = (data) => {
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: data.name },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: data.email },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: data.password },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: data.confirmPassword },
    });
    fireEvent.click(screen.getByLabelText(/acepto los términos/i));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    users.length = 0; // reset mock users
  });

  test("renderiza el formulario completo", () => {
    renderPage();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarme/i })).toBeInTheDocument();
  });

  test("muestra error si las contraseñas no coinciden", () => {
    renderPage();
    fillForm({
      name: "Juan",
      email: "juan@example.com",
      password: "1234",
      confirmPassword: "5678",
    });
    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test("muestra error si el email ya está registrado", () => {
    users.push({
      id: 1,
      email: "ya@existe.com",
      password: "1234",
    });

    renderPage();
    fillForm({
      name: "Pedro",
      email: "ya@existe.com",
      password: "1234",
      confirmPassword: "1234",
    });
    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/ya está registrado/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test("registra correctamente y redirige al dashboard", async () => {
    renderPage();
    fillForm({
      name: "María",
      email: "maria@example.com",
      password: "abcd",
      confirmPassword: "abcd",
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));
    });

    expect(mockRegister).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
  });
});
