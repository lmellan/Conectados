import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./SearchPage";
import { services } from "../data/mockData";

// Ignorar warning por act() deprecado
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (!msg.includes("ReactDOMTestUtils.act")) {
      console.error(msg);
    }
  });
});

describe("SearchPage", () => {
  beforeEach(() => {
    services.length = 0;
    services.push(
      {
        id: 1,
        title: "Servicio de Plomería",
        description: "Reparación de fugas y cañerías",
        category: "Plomería",
        price: 20000,
        providerId: 1,
        providerName: "Juan Pérez",
        providerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        image: "https://via.placeholder.com/300",
        rating: 4.5,
        reviews: 10,
      },
      {
        id: 2,
        title: "Limpieza profunda",
        description: "Servicio completo para tu hogar",
        category: "Limpieza",
        price: 15000,
        providerId: 2,
        providerName: "María González",
        providerImage: "https://randomuser.me/api/portraits/women/2.jpg",
        image: "https://via.placeholder.com/300",
        rating: 4.8,
        reviews: 20,
      }
    );
  });

  const renderPage = (query = "") =>
    render(
      <MemoryRouter initialEntries={[`/search${query}`]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

  test("renderiza el título y barra de búsqueda", () => {
    renderPage();
    expect(screen.getByText(/buscar servicios/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/qué servicio necesitas/i)).toBeInTheDocument();
  });

  test("muestra servicios filtrados por término de búsqueda", async () => {
    renderPage("?q=plomería");

    await screen.findByText(/servicio de plomería/i);
    expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
  });

  test("filtra por categoría correctamente", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "limpieza" },
    });

    await screen.findByText(/limpieza profunda/i);
    expect(screen.queryByText(/servicio de plomería/i)).not.toBeInTheDocument();
  });

  test("filtra por rango de precio", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/mínimo/i), {
      target: { value: "16000" },
    });

    await screen.findByText(/servicio de plomería/i);
    expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay resultados", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "carpinteria" },
    });

    await screen.findByText(/no se encontraron servicios/i);
  });

  test("restablece los filtros al hacer clic en 'Limpiar filtros'", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "limpieza" },
    });

    fireEvent.click(screen.getByRole("button", { name: /limpiar filtros/i }));

    await screen.findByText(/servicio de plomería/i);
    expect(screen.getByText(/limpieza profunda/i)).toBeInTheDocument();
  });
});
