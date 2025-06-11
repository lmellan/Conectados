// src/components/AvailabilityCalendar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
// No necesitas importar '@testing-library/jest-dom' aquí si ya lo tienes en setupFilesAfterEnv
// import '@testing-library/jest-dom';

import AvailabilityCalendar from './AvailabilityCalendar';

describe('AvailabilityCalendar', () => {
  // 1. Renderizado Básico y Estructura
  test('debe renderizar el título y los 7 días de la semana correctamente cuando no hay disponibilidad', () => {
    render(<AvailabilityCalendar availability={[]} />);
    expect(screen.getByRole('heading', { name: /Disponibilidad/i })).toBeInTheDocument();
    const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    daysOfWeek.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
    const noAvailabilityTexts = screen.getAllByText('No');
    expect(noAvailabilityTexts).toHaveLength(7);
    noAvailabilityTexts.forEach(textElement => {
      expect(textElement).toHaveClass('bg-gray-100');
      expect(textElement).toHaveClass('text-gray-400');
    });
    expect(screen.getByText(/\* Horario habitual: 9:00 AM - 6:00 PM/i)).toBeInTheDocument();
  });

  // 2. Días Disponibles Correctamente Marcados
  test('debe marcar los días correctos como disponibles (Sí y verde)', () => {
    render(<AvailabilityCalendar availability={[0, 2, 4]} />);
    const availableDaysTexts = screen.getAllByText('Sí');
    expect(availableDaysTexts).toHaveLength(3);
    availableDaysTexts.forEach(textElement => {
      expect(textElement).toHaveClass('bg-green-100');
      expect(textElement).toHaveClass('text-green-800');
    });
    const notAvailableDaysTexts = screen.getAllByText('No');
    expect(notAvailableDaysTexts).toHaveLength(4);
    notAvailableDaysTexts.forEach(textElement => {
      expect(textElement).toHaveClass('bg-gray-100');
      expect(textElement).toHaveClass('text-gray-400');
    });
  });

  // 3. Todos los Días Disponibles
  test('debe mostrar todos los días como disponibles (Sí y verde) cuando se le pasa todos los índices', () => {
    render(<AvailabilityCalendar availability={[0, 1, 2, 3, 4, 5, 6]} />);
    const availableDaysTexts = screen.getAllByText('Sí');
    expect(availableDaysTexts).toHaveLength(7);
    availableDaysTexts.forEach(textElement => {
      expect(textElement).toHaveClass('bg-green-100');
      expect(textElement).toHaveClass('text-green-800');
    });
    expect(screen.queryAllByText('No')).toHaveLength(0);
  });

  // 4. Ningún Día Disponible
  test('debe mostrar todos los días como no disponibles (No y gris) cuando se le pasa un arreglo vacío', () => {
    render(<AvailabilityCalendar availability={[]} />);
    const noAvailabilityTexts = screen.getAllByText('No');
    expect(noAvailabilityTexts).toHaveLength(7);
    noAvailabilityTexts.forEach(textElement => {
      expect(textElement).toHaveClass('bg-gray-100');
      expect(textElement).toHaveClass('text-gray-400');
    });
    expect(screen.queryAllByText('Sí')).toHaveLength(0);
  });

  // 5. Días Disponibles en Diferentes Órdenes
  test('el orden de los días en la prop availability no debe afectar el renderizado', () => {
    const { rerender } = render(<AvailabilityCalendar availability={[0, 2, 4]} />);
    expect(screen.getAllByText('Sí')).toHaveLength(3);
    expect(screen.getAllByText('No')).toHaveLength(4);
    rerender(<AvailabilityCalendar availability={[4, 0, 2]} />);
    expect(screen.getAllByText('Sí')).toHaveLength(3);
    expect(screen.getAllByText('No')).toHaveLength(4);
  });

  // 6. Manejo de Prop `availability` No Válida (ej. undefined, null)
  test('debe comportarse como si no hubiera disponibilidad si la prop availability es undefined o null', () => {
    const { rerender } = render(<AvailabilityCalendar availability={undefined} />);
    expect(screen.queryAllByText('Sí')).toHaveLength(0);
    expect(screen.getAllByText('No')).toHaveLength(7);
    rerender(<AvailabilityCalendar availability={null} />);
    expect(screen.queryAllByText('Sí')).toHaveLength(0);
    expect(screen.getAllByText('No')).toHaveLength(7);
  });

  // (Opcional) Un test para el mensaje de horario
  test('debe mostrar el mensaje de horario habitual', () => {
    render(<AvailabilityCalendar availability={[]} />);
    expect(screen.getByText('* Horario habitual: 9:00 AM - 6:00 PM')).toBeInTheDocument();
  });
});