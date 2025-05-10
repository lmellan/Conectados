import { render, screen } from '@testing-library/react';
import AvailabilityCalendar from './AvailabilityCalendar';

describe('AvailabilityCalendar', () => {
  test('renders all days of the week', () => {
    render(<AvailabilityCalendar availability={[]} />);
    
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('shows "Sí" with green background for available days', () => {
    render(<AvailabilityCalendar availability={[0, 2, 4]} />); // Lunes, Miércoles, Viernes disponibles

    const yesElements = screen.getAllByText("Sí");

    // Verificar que tengan la clase correcta
    yesElements.forEach(el => {
      expect(el).toHaveClass('bg-green-100');
      expect(el).toHaveClass('text-green-800');
    });
  });

  test('shows "No" with gray background for unavailable days', () => {
    render(<AvailabilityCalendar availability={[1, 3, 5]} />); // Martes, Jueves, Sábado disponibles

    const noElements = screen.getAllByText("No");

    // Verificar que tengan la clase correcta
    noElements.forEach(el => {
      expect(el).toHaveClass('bg-gray-100');
      expect(el).toHaveClass('text-gray-400');
    });
  });

  test('renders footer note about schedule', () => {
    render(<AvailabilityCalendar availability={[]} />);

    expect(screen.getByText(/\* Horario habitual/i)).toBeInTheDocument();
  });
});
