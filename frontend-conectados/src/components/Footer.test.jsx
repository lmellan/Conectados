import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  });

  test("renderiza el nombre del sitio y descripción", () => {
    expect(screen.getByText("Conectados")).toBeInTheDocument();
    expect(
      screen.getByText(/Conectando usuarios con los mejores profesionales/i)
    ).toBeInTheDocument();
  });

  test("renderiza los títulos de secciones", () => {
    expect(screen.getByText("Enlaces")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  test("renderiza todos los enlaces de navegación", () => {
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Buscar Servicios" })).toHaveAttribute("href", "/search");
    expect(screen.getByRole("link", { name: "Ofrecer Servicios" })).toHaveAttribute("href", "/register-pro");
  });

  test("renderiza la información de contacto", () => {
    expect(screen.getByText(/info@conectados\.com/)).toBeInTheDocument();
    expect(screen.getByText(/123.*456.*7890/)).toBeInTheDocument();
  });

  test("renderiza el año actual en el copyright", () => {
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });
});
