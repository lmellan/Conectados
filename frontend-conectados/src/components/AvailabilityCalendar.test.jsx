import { render, screen } from "@testing-library/react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { React, act } from "react";

describe("AvailabilityCalendar", () => {
  const availabilityExample = [0, 2, 4]; // Lunes, Miércoles, Viernes

  it("renderiza el título correctamente", () => {
    act(() => {
      render(<AvailabilityCalendar availability={availabilityExample} />);
    });
  
    expect(screen.getByText("Disponibilidad")).toBeInTheDocument();
  });

  it("renderiza todos los días de la semana", () => {
    act(() => {
      render(<AvailabilityCalendar availability={availabilityExample} />);
    });
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    dias.forEach((dia) => {
      expect(screen.getByText(dia)).toBeInTheDocument();
    });
  });

  it("marca correctamente los días disponibles como 'Sí'", () => {
    act(() => {
      render(<AvailabilityCalendar availability={availabilityExample} />);
    });
    const siElements = screen.getAllByText("Sí");
    expect(siElements).toHaveLength(3); // Lun, Mié, Vie
  });

  it("marca correctamente los días no disponibles como 'No'", () => {
    act(() => {
      render(<AvailabilityCalendar availability={availabilityExample} />);
    });
    const noElements = screen.getAllByText("No");
    expect(noElements).toHaveLength(4); // Mar, Jue, Sáb, Dom
  });

  it("muestra la nota de horario habitual", () => {
    act(() => {
      render(<AvailabilityCalendar availability={availabilityExample} />);
    });
    expect(
      screen.getByText("* Horario habitual: 9:00 AM - 6:00 PM")
    ).toBeInTheDocument();
  });
});
