import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import ServiceCard from "./ServiceCard";

describe("ServiceCard", () => {
  const serviceMock = {
    id: 42,
    title: "Reparación de lavadoras",
    category: "Electrodomésticos",
    image: "/lavadora.jpg",
    providerName: "Juan Pérez",
    providerImage: "/juan.jpg",
    description: "Reparo lavadoras de todo tipo, con garantía.",
    price: 15000,
  };

  test("renderiza el título, categoría y nombre del proveedor", () => {
    act(() => {
      render(
        <MemoryRouter>
          <ServiceCard service={serviceMock} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Reparación de lavadoras")).toBeInTheDocument();
    expect(screen.getByText("Electrodomésticos")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  test("muestra la descripción y precio correctamente", () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Reparo lavadoras/i)).toBeInTheDocument();
    expect(screen.getByText("$15000/hora")).toBeInTheDocument();
  });

  test("el botón 'Ver detalles' lleva al enlace correcto", () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /ver detalles/i });
    expect(link).toHaveAttribute("href", "/service/42");
  });

  test("usa imágenes proporcionadas si están disponibles", () => {
    const { container } = render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    const [mainImg, avatarImg] = container.querySelectorAll("img");
    expect(mainImg).toHaveAttribute("src", "/lavadora.jpg");
    expect(avatarImg).toHaveAttribute("src", "/juan.jpg");
  });

  test("usa imágenes por defecto si no hay imágenes disponibles", () => {
    const serviceSinImagenes = { ...serviceMock, image: null, providerImage: null };

    const { container } = render(
      <MemoryRouter>
        <ServiceCard service={serviceSinImagenes} />
      </MemoryRouter>
    );

    const [mainImg, avatarImg] = container.querySelectorAll("img");
    expect(mainImg).toHaveAttribute("src", "/placeholder.svg");
    expect(avatarImg).toHaveAttribute("src", "/placeholder.svg");
  });
});
