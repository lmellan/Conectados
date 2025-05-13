import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RegisterProPage from "./RegisterProPage";
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

describe("RegisterProPage", () => {
  const mockRegister = jest.fn();

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: mockRegister }}>
          <RegisterProPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Camila Torres" },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "camila@correo.com" },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/profesión/i), {
      target: { value: "Electricista" },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: "Tengo 5 años de experiencia" },
    });
    fireEvent.change(screen.getByLabelText(/tarifa por hora/i), {
      target: { value: "20000" },
    });
    fireEvent.click(screen.getByLabelText("Lunes"));
    fireEvent.click(screen.getByLabelText(/acepto los/i));
  };

  beforeEach(() => {
    users.length = 0;
    jest.clearAllMocks();
  });

  test("renderiza todos los campos", () => {
    renderPage();

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tarifa por hora/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Lunes")).toBeInTheDocument();
  });

  test("muestra error si contraseñas no coinciden", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "xyz" },
    });
    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/contraseñas no coinciden/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test("muestra error si no se selecciona disponibilidad", () => {
    renderPage();
    fillForm(); // luego desmarca disponibilidad
    fireEvent.click(screen.getByLabelText("Lunes")); // quita la selección

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));
    expect(
      screen.getByText(/debes seleccionar al menos un día/i)
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test("muestra error si el email ya está registrado", () => {
    users.push({
      id: 1,
      email: "camila@correo.com",
      password: "1234",
    });

    renderPage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/ya está registrado/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test("registra correctamente y redirige a /pro-dashboard", async () => {
    renderPage();
    fillForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));
    });

    expect(mockRegister).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
  });
});
