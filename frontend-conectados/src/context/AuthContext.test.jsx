import { React, act } from 'react'; 
import { render, screen } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  jest.clearAllMocks();
});

const TestComponent = () => {
  const { user, login, logout, register } = React.useContext(AuthContext);

  return (
    <div>
      <p data-testid="user">{user ? user.name : "sin usuario"}</p>
      <button onClick={() => login({ name: "Juan" })}>Login</button>
      <button onClick={() => register({ name: "Ana" })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

describe("AuthContext", () => {
  test("inicializa sin usuario", async () => {
    Storage.prototype.getItem.mockReturnValue(null);

    await act(async () => {
      renderWithProvider();
    });

    expect(screen.getByTestId("user").textContent).toBe("sin usuario");
    expect(Storage.prototype.getItem).toHaveBeenCalledWith("user");
  });

  test("login guarda usuario en estado y localStorage", async () => {
    await act(async () => {
      renderWithProvider();
    });

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Juan");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ name: "Juan" })
    );
  });

  test("register actúa igual que login", async () => {
    await act(async () => {
      renderWithProvider();
    });

    await act(async () => {
      screen.getByText("Register").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Ana");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ name: "Ana" })
    );
  });

  test("logout elimina usuario del estado y localStorage", async () => {
    await act(async () => {
      renderWithProvider();
    });

    // Login primero
    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Juan");

    // Logout después
    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("sin usuario");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
