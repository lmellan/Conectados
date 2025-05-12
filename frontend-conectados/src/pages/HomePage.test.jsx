import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { services, testimonials } from "../data/mockData";

describe("HomePage", () => {
  beforeEach(() => {
    // Simula datos mínimos si están vacíos
    if (services.length === 0) {
      services.push({
        id: 1,
        title: "Electricista certificado",
        category: "Electricidad",
        description: "Instalaciones y reparaciones",
        price: 25000,
        providerId: 1,
        providerName: "Pedro",
        providerImage: "/p.jpg",
        image: "/img.jpg",
        rating: 4.9,
        reviews: 10,
      });
    }

    if (testimonials.length === 0) {
      testimonials.push({
        id: 1,
        userName: "Laura",
        userImage: "/l.jpg",
        rating: 5,
        text: "Excelente servicio!",
        service: "Plomería",
      });
    }
  });

  test("renderiza el título y el texto principal", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Conectados – Servicios a un Clic")).toBeInTheDocument();
    expect(screen.getByText(/Conectamos a usuarios con los mejores/i)).toBeInTheDocument();
  });

  test("renderiza el botón 'Buscar Servicios' y 'Ofrecer mis Servicios'", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /buscar servicios/i })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("link", { name: /ofrecer mis servicios/i })).toHaveAttribute("href", "/register-pro");
  });

  test("renderiza el componente SearchBar", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("¿Qué servicio necesitas?")).toBeInTheDocument();
  });

  test("renderiza secciones de Categorías, Destacados y Testimonios", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Explora por Categoría")).toBeInTheDocument();
    expect(screen.getByText("Servicios Destacados")).toBeInTheDocument();
    expect(screen.getByText("Lo que dicen nuestros usuarios")).toBeInTheDocument();
  });

  test("renderiza al menos un servicio destacado", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  
    // Este título sí existe en mockData
    expect(
      screen.getByText("Instalación eléctrica completa")
    ).toBeInTheDocument();
  });

  test("renderiza al menos un testimonio", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  
    // El nombre correcto es "Sofía López"
    expect(screen.getByText("Sofía López")).toBeInTheDocument();
    expect(
      screen.getByText(/excelente servicio/i)
    ).toBeInTheDocument();
  });

  test("renderiza sección CTA para profesionales", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("¿Eres un profesional?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /registrarme como profesional/i })).toHaveAttribute(
      "href",
      "/register-pro"
    );
  });
});
