import React from "react";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProProfilePage from "./ProProfilePage";
import { users, services, testimonials } from "../data/mockData";

// Mock useParams
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
  };
});

describe("ProProfilePage", () => {
  beforeEach(() => {
    users.length = 0;
    services.length = 0;
    testimonials.length = 0;

    users.push({
      id: 1,
      name: "Andrea López",
      image: "/andrea.jpg",
      profession: "Electricidad",
      hourlyRate: 25000,
      description: "Soy una experta en instalaciones eléctricas.",
      isProfessional: true,
    });

    services.push({
      id: 10,
      providerId: 1,
      title: "Instalación de focos",
      category: "Electricidad",
      price: 15000,
      image: "/focos.jpg",
    });

    testimonials.push({
      id: 5,
      userName: "Luis",
      userImage: "/luis.jpg",
      rating: 5,
      text: "Muy buena atención",
      service: "Electricidad",
    });
  });

  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={["/pro/1"]}>
        <Routes>
          <Route path="/pro/:id" element={<ProProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

  test("muestra loader inicial", async () => {
    renderPage();
    expect(screen.getByText(/cargando perfil/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText(/cargando perfil/i)
      ).not.toBeInTheDocument()
    );
  });

  test("renderiza los datos del profesional", async () => {
    renderPage();

    expect(await screen.findByText("Andrea López")).toBeInTheDocument();
    expect(screen.getAllByText("Electricidad").length).toBeGreaterThan(0);
    expect(screen.getByText(/Soy una experta/i)).toBeInTheDocument();
    expect(screen.getByText("$25000/hora")).toBeInTheDocument();
  });

  test("renderiza servicios ofrecidos", async () => {
    renderPage();
    expect(await screen.findByText("Instalación de focos")).toBeInTheDocument();
  });

  test("renderiza reseñas del profesional", async () => {
    renderPage();
    expect(await screen.findByText("Luis")).toBeInTheDocument();
    expect(screen.getByText(/muy buena atención/i)).toBeInTheDocument();
    expect(screen.getByText(/servicio: electricidad/i)).toBeInTheDocument();
  });

  test("muestra mensaje si el profesional no existe", async () => {
    users.length = 0;
    renderPage();

    expect(await screen.findByText("Profesional no encontrado")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver a la búsqueda/i })).toHaveAttribute("href", "/search");
  });

  test("muestra mensajes si no hay servicios ni reseñas", async () => {
    services.length = 0;
    testimonials.length = 0;
    renderPage();

    expect(await screen.findByText(/aún no ha publicado servicios/i)).toBeInTheDocument();
    expect(screen.getByText(/aún no tiene reseñas/i)).toBeInTheDocument();
  });
});
