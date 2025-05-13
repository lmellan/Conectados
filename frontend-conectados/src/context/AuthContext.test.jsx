import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import React, { useContext } from "react";

// Componente auxiliar para acceder al contexto dentro del test
const TestComponent = () => {
  const { user, login, logout, register } = useContext(AuthContext);

  return (
    <div>
      <p data-testid="user">{user ? user.email : "No hay usuario"}</p>
      <button onClick={() => login({ email: "test@example.com" })}>Login</button>
      <button onClick={() => register({ email: "new@example.com" })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("carga usuario desde localStorage si existe", async () => {
    localStorage.setItem("user", JSON.stringify({ email: "stored@example.com" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("stored@example.com");
    });
  });

  test("login guarda usuario en estado y localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText("Login").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
      expect(JSON.parse(localStorage.getItem("user"))).toEqual({ email: "test@example.com" });
    });
  });

  test("register guarda usuario en estado y localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText("Register").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("new@example.com");
      expect(JSON.parse(localStorage.getItem("user"))).toEqual({ email: "new@example.com" });
    });
  });

  test("logout limpia usuario del estado y localStorage", async () => {
    localStorage.setItem("user", JSON.stringify({ email: "logout@example.com" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar a que cargue el usuario
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("logout@example.com");
    });

    screen.getByText("Logout").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("No hay usuario");
      expect(localStorage.getItem("user")).toBe(null);
    });
  });
});
