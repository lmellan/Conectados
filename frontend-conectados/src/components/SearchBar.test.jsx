import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import { act } from "react";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renderiza el título, categoría y nombre del proveedor", () => {
    act(() => {
      render(
        <MemoryRouter>
          <SearchBar />
        </MemoryRouter>
      );
    });


  
    expect(screen.getByPlaceholderText("¿Qué servicio necesitas?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  test("actualiza el valor del input cuando se escribe", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("¿Qué servicio necesitas?");
    fireEvent.change(input, { target: { value: "plomería" } });
    expect(input.value).toBe("plomería");
  });

  test("navega a la ruta de búsqueda al enviar el formulario", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("¿Qué servicio necesitas?");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "electricidad" } });
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith("/search?q=electricidad");
  });

  test("aplica la clase adicional pasada por props", () => {
    const { container } = render(
      <MemoryRouter>
        <SearchBar className="mt-10" />
      </MemoryRouter>
    );

    expect(container.firstChild).toHaveClass("mt-10");
  });
});
