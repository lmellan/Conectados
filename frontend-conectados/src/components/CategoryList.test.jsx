import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryList from "./CategoryList";

describe("CategoryList", () => {
  const categoriasEsperadas = [
    { slug: "limpieza", name: "Limpieza" },
    { slug: "electricidad", name: "Electricidad" },
    { slug: "plomeria", name: "Plomería" },
    { slug: "jardineria", name: "Jardinería" },
    { slug: "peluqueria", name: "Peluquería" },
    { slug: "carpinteria", name: "Carpintería" },
  ];

  it("renderiza todas las categorías", () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    categoriasEsperadas.forEach((cat) => {
      expect(screen.getByText((text) => text.includes(cat.name))).toBeInTheDocument();
    });
  });

  it("cada categoría tiene un enlace correcto", () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    categoriasEsperadas.forEach((cat) => {
      const link = screen.getByRole("link", {
        name: (name) => name.includes(cat.name),
      });
      expect(link).toHaveAttribute("href", `/search?category=${cat.slug}`);
    });
  });
});
