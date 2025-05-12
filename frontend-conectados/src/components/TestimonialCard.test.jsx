import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialCard from "./TestimonialCard";

describe("TestimonialCard", () => {
  const testimonialMock = {
    userName: "María Gómez",
    userImage: "/maria.jpg",
    rating: 4,
    text: "Excelente servicio, muy puntual y profesional.",
    service: "Electricidad",
  };

  test("muestra nombre del usuario y testimonio", () => {
    render(<TestimonialCard testimonial={testimonialMock} />);
    expect(screen.getByText("María Gómez")).toBeInTheDocument();
    expect(
      screen.getByText(/Excelente servicio, muy puntual/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Servicio: Electricidad")).toBeInTheDocument();
  });

  test("muestra imagen del usuario o imagen por defecto", () => {
    const { container } = render(
      <TestimonialCard testimonial={testimonialMock} />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/maria.jpg");
    expect(img).toHaveAttribute("alt", "María Gómez");
  });

  test("usa imagen por defecto si no hay imagen del usuario", () => {
    const testimonialSinImagen = { ...testimonialMock, userImage: null };
    const { container } = render(
      <TestimonialCard testimonial={testimonialSinImagen} />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/placeholder.svg");
  });

  test("muestra exactamente 5 estrellas (svg)", () => {
    const { container } = render(
      <TestimonialCard testimonial={testimonialMock} />
    );
    const stars = container.querySelectorAll("svg");
    expect(stars.length).toBe(5);
  });

  test("colorea correctamente las estrellas según el rating", () => {
    const { container } = render(
      <TestimonialCard testimonial={{ ...testimonialMock, rating: 3 }} />
    );
    const stars = container.querySelectorAll("svg");
    const coloredStars = Array.from(stars).filter((el) =>
      el.classList.contains("text-yellow-400")
    );
    const grayStars = Array.from(stars).filter((el) =>
      el.classList.contains("text-gray-300")
    );

    expect(coloredStars.length).toBe(3);
    expect(grayStars.length).toBe(2);
  });
});
