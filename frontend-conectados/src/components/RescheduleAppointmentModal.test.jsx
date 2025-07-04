import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RescheduleAppointmentModal from './RescheduleAppointmentModal';
import axios from 'axios';

// Mock del componente AvailabilityCalendar para evitar renderizado real del calendario
jest.mock('./AvailabilityCalendar', () => {
  // eslint-disable-next-line react/display-name
  return ({ availability }) => (
    <div data-testid="mock-availability-calendar">
      Disponibilidad del calendario mockeada: {JSON.stringify(availability)}
    </div>
  );
});

// Mock de axios
jest.mock('axios');

describe('RescheduleAppointmentModal', () => {
  const mockBooking = {
    id: 123,
    idBuscador: 1,
    idPrestador: 101,
    idServicio: 201,
    fecha: '2025-07-15',
    hora: '10:00',
    estado: 'Pendiente',
    serviceDetails: { title: 'Corte de Pelo' },
    cliente: { nombre: 'Juan Pérez' },
  };

  const mockProviderAvailability = {
    disponibilidad: ['Lunes', 'Miércoles', 'Viernes'],
    horaInicio: '09:00',
    horaFin: '17:00',
  };

  const mockOnClose = jest.fn();
  const mockOnRescheduleSuccess = jest.fn();
  const mockToken = 'test-token-123';

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    // Mockear la fecha actual para consistencia en las pruebas de validación de fecha
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-07-01T12:00:00Z')); // Establecer una fecha fija (futura a la actual para el test)
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderModal = (props) => {
    return render(
      <RescheduleAppointmentModal
        booking={mockBooking}
        providerAvailability={mockProviderAvailability}
        onClose={mockOnClose}
        onRescheduleSuccess={mockOnRescheduleSuccess}
        token={mockToken}
        {...props}
      />
    );
  };

  test('debe renderizar el modal con la información de la cita y el calendario de disponibilidad', () => {
    renderModal();

    expect(screen.getByText('Reprogramar Cita')).toBeInTheDocument();

    // FIXED: Find the paragraph element and check its textContent more flexibly
    // We can use a regex on the textContent of the paragraph itself.
    // The 'p' role might not be available directly, so we can search by className or inspect the tree.
    // A robust way is to find a specific text chunk and then check its parent.
    const serviceInfoElement = screen.getByText('Servicio:', { exact: false }); // Find a unique part of the text
    expect(serviceInfoElement).toBeInTheDocument();
    // Now, assert that its parent (or ancestor) contains the full combined text
    // The closest parent that contains all the text is the <p> tag itself.
    // Using a regex with `toMatch` for flexibility with whitespace.
    expect(serviceInfoElement.closest('p')).toHaveTextContent(
      /Servicio:\s*Corte de Pelo\s*con\s*Juan Pérez/i
    );


    expect(screen.getByText('Fecha actual: 2025-07-15 Hora actual: 10:00')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad del Prestador:')).toBeInTheDocument();
    expect(screen.getByTestId('mock-availability-calendar')).toBeInTheDocument();
    expect(screen.getByText('Horario: 09:00 - 17:00')).toBeInTheDocument();

    expect(screen.getByLabelText('Nueva Fecha')).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva Hora')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar Reprogramación' })).toBeInTheDocument();
  });

  test('debe inicializar la fecha y hora con los valores de la reserva', () => {
    renderModal();
    expect(screen.getByLabelText('Nueva Fecha')).toHaveValue('2025-07-15');
    expect(screen.getByLabelText('Nueva Hora')).toHaveValue('10:00');
  });

  test('debe mostrar horas disponibles correctamente según el rango del prestador', () => {
    renderModal();
    const timeSelect = screen.getByLabelText('Nueva Hora');
    expect(timeSelect).toHaveTextContent('09:00');
    expect(timeSelect).toHaveTextContent('09:30');
    expect(timeSelect).toHaveTextContent('16:30');
    expect(timeSelect).toHaveTextContent('17:00'); // Incluye la hora de fin si es en punto o media
    expect(timeSelect).not.toHaveTextContent('17:30'); // No debe exceder la hora de fin
    // Calculation: 1 default option + ((17-9) * 2 options per hour) + 1 (for 17:00 if it's not already covered)
    // (17-9) = 8 hours. 8 hours * 2 options/hour (XX:00, XX:30) = 16 options. Plus 17:00 = 17 options.
    // Plus the initial "Seleccionar hora" option = 18.
    expect(timeSelect.children.length).toBe(1 + (17 - 9) * 2 + 1);
  });

  test('debe mostrar un mensaje de error si se intenta reprogramar sin seleccionar fecha', async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText('Nueva Fecha'), { target: { value: '' } }); // Borrar la fecha
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    await waitFor(() => {
      expect(screen.getByText('Por favor, selecciona una fecha.')).toBeInTheDocument();
    });
    expect(axios.put).not.toHaveBeenCalled();
    expect(mockOnRescheduleSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('debe mostrar un mensaje de error si se intenta reprogramar sin seleccionar hora', async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText('Nueva Hora'), { target: { value: '' } }); // Borrar la hora
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    await waitFor(() => {
      expect(screen.getByText('Por favor, selecciona una hora.')).toBeInTheDocument();
    });
    expect(axios.put).not.toHaveBeenCalled();
    expect(mockOnRescheduleSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('debe mostrar un error si se intenta reprogramar una fecha en el pasado', async () => {
    renderModal();

    // The system time is mocked to '2025-07-01T12:00:00Z'.
    // So, '2025-06-30' is in the past.
    fireEvent.change(screen.getByLabelText('Nueva Fecha'), { target: { value: '2025-06-30' } });
    fireEvent.change(screen.getByLabelText('Nueva Hora'), { target: { value: '10:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    await waitFor(() => {
      expect(screen.getByText('No puedes reprogramar una cita en el pasado.')).toBeInTheDocument();
    });
    expect(axios.put).not.toHaveBeenCalled();
  });

  test('debe llamar a la API de reprogramación con los datos correctos al confirmar', async () => {
    axios.put.mockResolvedValueOnce({ data: {} }); // Simular una respuesta exitosa

    renderModal();

    const newDate = '2025-07-20';
    const newTime = '14:30';

    fireEvent.change(screen.getByLabelText('Nueva Fecha'), { target: { value: newDate } });
    fireEvent.change(screen.getByLabelText('Nueva Hora'), { target: { value: newTime } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    // Wait for the axios.put call and its resolution, which should then trigger mockOnRescheduleSuccess
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(mockOnRescheduleSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    expect(axios.put).toHaveBeenCalledWith(
      `http://localhost:8080/api/citas/editar/${mockBooking.id}`,
      {
        idBuscador: mockBooking.idBuscador,
        idPrestador: mockBooking.idPrestador,
        idServicio: mockBooking.idServicio,
        fecha: newDate,
        hora: newTime,
        estado: mockBooking.estado,
      },
      { headers: { Authorization: `Bearer ${mockToken}` } }
    );
    expect(screen.getByRole('button', { name: 'Confirmar Reprogramación' })).not.toBeDisabled();
  });

  test('debe mostrar un mensaje de error si la llamada a la API falla', async () => {
    const errorMessage = 'Error del servidor al reprogramar.';
    axios.put.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

    renderModal();

    const newDate = '2025-07-20';
    const newTime = '14:30';

    fireEvent.change(screen.getByLabelText('Nueva Fecha'), { target: { value: newDate } });
    fireEvent.change(screen.getByLabelText('Nueva Hora'), { target: { value: newTime } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    await waitFor(() => {
      // Use a more flexible text matcher for the error message
      // The error message is split across <strong> and <span> tags
      expect(screen.getByText((content, element) => {
        const hasText = (text) => element.textContent.includes(text);
        const isAlert = element.getAttribute('role') === 'alert';
        return isAlert && hasText('Error:') && hasText(errorMessage);
      })).toBeInTheDocument();
    });

    expect(mockOnRescheduleSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Confirmar Reprogramación' })).not.toBeDisabled(); // El botón se habilita de nuevo
  });

  test('debe deshabilitar los botones mientras la reprogramación está en progreso', async () => {
    axios.put.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))); // Simular retardo

    renderModal();

    fireEvent.change(screen.getByLabelText('Nueva Fecha'), { target: { value: '2025-07-20' } });
    fireEvent.change(screen.getByLabelText('Nueva Hora'), { target: { value: '14:30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reprogramación' }));

    expect(screen.getByRole('button', { name: 'Reprogramando...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reprogramando...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Confirmar Reprogramación' })).not.toBeDisabled();
    });
  });

  test('debe llamar a onClose cuando se hace clic en el botón Cancelar', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('no debe renderizar el modal si booking es nulo', () => {
    const { container } = render(
      <RescheduleAppointmentModal
        booking={null} // Pasamos booking como null
        providerAvailability={mockProviderAvailability}
        onClose={mockOnClose}
        onRescheduleSuccess={mockOnRescheduleSuccess}
        token={mockToken}
      />
    );
    expect(container).toBeEmptyDOMElement(); // El modal no debe renderizarse
  });
});