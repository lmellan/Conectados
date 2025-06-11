import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import axios from "axios";

// Mock de useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock de axios
jest.mock("axios");

// Componente de prueba para consumir el contexto
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="token">{auth.token}</span>
      <span data-testid="user">{auth.user ? JSON.stringify(auth.user) : "null"}</span>
      <span data-testid="rolActivo">{auth.rolActivo}</span>
      <span data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</span>
      <button onClick={() => auth.login({ correo: "test@example.com", rolActivo: "ADMIN" }, "fake-token")}>Login</button>
      <button onClick={auth.logout}>Logout</button>
      <button onClick={() => auth.switchRole("GESTOR")}>Switch Role</button>
    </div>
  );
};

describe("AuthContext", () => {
  // Limpiar localStorage y mocks antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
    axios.put.mockReset();
    axios.defaults.headers.common = {}; // Limpiar headers de axios
  });

  test("debería inicializarse con valores nulos si no hay nada en localStorage", () => {
    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByTestId("token").textContent).toBe("");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("rolActivo").textContent).toBe("BUSCADOR"); // Valor por defecto
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
  });

  test("debería inicializarse con datos de localStorage si existen", () => {
    const initialUser = { correo: "init@example.com", rolActivo: "CLIENTE" };
    localStorage.setItem("token", "initial-token");
    localStorage.setItem("user", JSON.stringify(initialUser));

    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByTestId("token").textContent).toBe("initial-token");
    expect(screen.getByTestId("user").textContent).toBe(JSON.stringify(initialUser));
    expect(screen.getByTestId("rolActivo").textContent).toBe("CLIENTE");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
  });

  test("login debería establecer user, token, rolActivo y navegar", async () => {
    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      userEvent.click(loginButton);
    });

    const expectedUser = { correo: "test@example.com", rolActivo: "ADMIN" };
    expect(screen.getByTestId("token").textContent).toBe("fake-token");
    expect(screen.getByTestId("user").textContent).toBe(JSON.stringify(expectedUser));
    expect(screen.getByTestId("rolActivo").textContent).toBe("ADMIN");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");

    expect(localStorage.getItem("token")).toBe("fake-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(expectedUser));
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer fake-token");
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/admin", { replace: true });
  });

  test("logout debería limpiar user, token, rolActivo y navegar", async () => {
    // Simular estado logueado
    localStorage.setItem("token", "logged-in-token");
    localStorage.setItem("user", JSON.stringify({ correo: "user@example.com", rolActivo: "GESTOR" }));

    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );

    // Asegurarse de que el estado inicial es logueado
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");

    const logoutButton = screen.getByText("Logout");
    await act(async () => {
      userEvent.click(logoutButton);
    });

    expect(screen.getByTestId("token").textContent).toBe("");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("rolActivo").textContent).toBe("BUSCADOR");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull(); // localStorage.clear() limpia todo
    expect(axios.defaults.headers.common["Authorization"]).toBeUndefined();
    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  describe("switchRole", () => {
    const initialUser = {
      id: "123",
      correo: "test@example.com",
      roles: ["ADMIN", "GESTOR", "BUSCADOR"],
      rolActivo: "BUSCADOR",
    };
    const initialToken = "current-token";

    beforeEach(() => {
      localStorage.setItem("token", initialToken);
      localStorage.setItem("user", JSON.stringify(initialUser));
    });

    test("debería actualizar el rol activo y navegar al dashboard correcto si la API es exitosa", async () => {
      const updatedUser = { ...initialUser, rolActivo: "GESTOR" };
      axios.put.mockResolvedValueOnce({ data: updatedUser });

      render(
        <Router>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </Router>
      );

      // Comprobar estado inicial del rol
      expect(screen.getByTestId("rolActivo").textContent).toBe("BUSCADOR");

      const switchRoleButton = screen.getByText("Switch Role");
      await act(async () => {
        userEvent.click(switchRoleButton);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          `http://localhost:8080/api/usuarios/${encodeURIComponent(initialUser.correo)}/cambiar-rol`,
          { nuevoRol: "GESTOR" }
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId("rolActivo").textContent).toBe("GESTOR");
        expect(screen.getByTestId("user").textContent).toBe(JSON.stringify(updatedUser));
        expect(localStorage.getItem("user")).toBe(JSON.stringify(updatedUser));
        expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/gestor", { replace: true });
      });
    });

    test("debería mostrar una alerta si no hay usuario o token", async () => {
      localStorage.clear(); // Asegurarse de que no hay usuario/token
      jest.spyOn(window, "alert").mockImplementation(() => {}); // Mockear alert

      render(
        <Router>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </Router>
      );

      const switchRoleButton = screen.getByText("Switch Role");
      await act(async () => {
        userEvent.click(switchRoleButton);
      });

      expect(window.alert).toHaveBeenCalledWith("Sesión inválida. Por favor vuelve a iniciar sesión.");
      expect(axios.put).not.toHaveBeenCalled();
      expect(mockedNavigate).not.toHaveBeenCalled();
      window.alert.mockRestore(); // Restaurar alert
    });

    test("debería mostrar una alerta si la llamada a la API falla", async () => {
      axios.put.mockRejectedValueOnce({ response: { data: { message: "Error de servidor" } } });
      jest.spyOn(window, "alert").mockImplementation(() => {});

      render(
        <Router>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </Router>
      );

      const switchRoleButton = screen.getByText("Switch Role");
      await act(async () => {
        userEvent.click(switchRoleButton);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });

      expect(window.alert).toHaveBeenCalledWith("No se pudo cambiar el rol.");
      expect(mockedNavigate).not.toHaveBeenCalled(); // No debe navegar si falla
      // El rol no debería cambiar en el estado
      expect(screen.getByTestId("rolActivo").textContent).toBe("BUSCADOR"); // Sigue con el rol inicial
      window.alert.mockRestore();
    });
  });

  test("useEffect debería configurar el header de autorización cuando el token está presente", () => {
    localStorage.setItem("token", "test-token-header");
    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer test-token-header");
  });

  test("useEffect debería eliminar el header de autorización cuando el token es nulo", async () => {
    localStorage.setItem("token", "some-token"); // Simular que hay un token inicialmente
    render(
      <Router>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </Router>
    );

    // Asegurarse de que el token está configurado
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer some-token");

    const logoutButton = screen.getByText("Logout");
    await act(async () => {
      userEvent.click(logoutButton);
    });

    // Después del logout, el token debería ser nulo y el header debería ser eliminado
    expect(axios.defaults.headers.common["Authorization"]).toBeUndefined();
  });
});