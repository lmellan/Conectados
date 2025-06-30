// At the very top of UserDashboard.test.jsx
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
//                                                     ^^^^^^^  <-- Make sure 'within' is here!

// The rest of your imports should follow:
import { BrowserRouter, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UserDashboard from '../pages/UserDashboard';
// --- Mocks Esenciales ---

// Mock de react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa Link y Navigate reales si son usados
  useNavigate: () => mockedUseNavigate,
  Link: ({ to, children, className }) => <a href={to} className={className}>{children}</a>, // Mock de Link para que sea un <a> simple
  Navigate: ({ to }) => <div data-testid="navigate-to" data-path={to}></div>, // Mock de Navigate para espiar redirecciones
}));

// Mock de axios
jest.mock('axios');

// Mock de AuthContext
// Exporta esta variable para poder controlarla en tests individuales
let mockUseAuthValue = {};
jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuthValue,
}));

// Mock de window.confirm y window.open para evitar interacciones reales del navegador
const mockConfirm = jest.fn(() => true); // Por defecto, confirma la acción
const mockOpen = jest.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
});
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});


// Helper para renderizar el componente con los contextos y router necesarios
const renderWithRouterAndContext = (ui, { authProps, ...renderOptions } = {}) => {
  mockUseAuthValue = authProps; // Actualiza el valor del mock de useAuth
  return render(
    <BrowserRouter>{ui}</BrowserRouter>,
    renderOptions
  );
};

// --- Datos de prueba ---
const mockUserBuscador = { id: 'user1', nombre: 'Test Buscador', correo: 'test@buscador.com', roles: ['BUSCADOR'], foto: 'user-photo.jpg' };
const mockUserProfesional = { id: 'user2', nombre: 'Test Profesional', correo: 'test@profesional.com', roles: ['BUSCADOR', 'PRESTADOR'], foto: 'prof-photo.jpg' };

const mockPendingBooking = {
  id: 'cita1',
  idServicio: 'serviceA',
  idBuscador: 'user1',
  estado: 'Pendiente',
  fecha: '2025-07-10',
  hora: '10:00',
  serviceDetails: {
    title: 'Servicio de Electricidad',
    prestador: { nombre: 'Juan Pérez', numero: '+56912345678' },
    image: '/electricista.jpg',
  },
  reviewed: false,
};

const mockCompletedBooking = {
  id: 'cita2',
  idServicio: 'serviceB',
  idBuscador: 'user1',
  estado: 'Completada',
  fecha: '2025-06-01',
  hora: '14:00',
  serviceDetails: {
    title: 'Servicio de Plomería',
    prestador: { nombre: 'María González' },
    image: '/plomeria.jpg',
  },
  reviewed: false,
};

const mockCompletedReviewedBooking = {
  id: 'cita3',
  idServicio: 'serviceC',
  idBuscador: 'user1',
  estado: 'Completada',
  fecha: '2025-05-15',
  hora: '09:00',
  serviceDetails: {
    title: 'Servicio de Limpieza',
    prestador: { nombre: 'Ana López' },
    image: '/limpieza.jpg',
    resenas: [{ buscador: { id: 'user1' } }], // Simular que ya fue reseñado
  },
  reviewed: true,
};

describe('UserDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Resetear mocks de axios y window functions
    axios.get.mockReset();
    axios.delete.mockReset();
    mockConfirm.mockClear();
    mockConfirm.mockReturnValue(true); // Resetear a true por defecto
    mockOpen.mockClear();

    // Mockear la respuesta inicial de obtener citas y servicios para evitar errores en setup
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/citas/buscador/')) {
        return Promise.resolve({ data: [mockPendingBooking, mockCompletedBooking, mockCompletedReviewedBooking] });
      }
      if (url.includes('/api/servicios/serviceA')) {
        return Promise.resolve({ data: { nombre: 'Servicio de Electricidad', prestador: { nombre: 'Juan Pérez', numero: '+56912345678' }, foto: '/electricista.jpg', resenas: [] } });
      }
      if (url.includes('/api/servicios/serviceB')) {
        return Promise.resolve({ data: { nombre: 'Servicio de Plomería', prestador: { nombre: 'María González' }, foto: '/plomeria.jpg', resenas: [] } });
      }
      if (url.includes('/api/servicios/serviceC')) {
        return Promise.resolve({ data: { nombre: 'Servicio de Limpieza', prestador: { nombre: 'Ana López' }, foto: '/limpieza.jpg', resenas: [{ buscador: { id: 'user1' } }] } });
      }
      return Promise.reject(new Error(`URL no mockeada: ${url}`));
    });
  });

  // Test 1: Redirección si no hay usuario logueado
  test('no renderiza nada y no hace llamadas a la API si no hay usuario', () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: null, token: null },
    });

    expect(screen.queryByText('Completa tu Perfil Profesional')).not.toBeInTheDocument();
    expect(axios.get).not.toHaveBeenCalled();
  });

  // Test 2: Renderizado del perfil de usuario y enlace a buscar servicios
  test('debe renderizar la información del usuario y el botón para buscar servicios', async () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockUserBuscador.nombre)).toBeInTheDocument();
      expect(screen.getByText(mockUserBuscador.correo)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Buscar Nuevos Servicios' })).toHaveAttribute('href', '/search');
      expect(screen.getByAltText(mockUserBuscador.nombre)).toHaveAttribute('src', mockUserBuscador.foto);
    });
  });

  // Test 3: Renderizado condicional del banner "Conviértete en Profesional"
  test('debe mostrar el banner "Conviértete en Profesional" si el usuario no es profesional', async () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText('¿Quieres ofrecer tus servicios?')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Conviértete en Profesional' })).toHaveAttribute('href', '/become-professional');
    });
  });

  test('no debe mostrar el banner "Conviértete en Profesional" si el usuario es profesional', async () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserProfesional, token: 'mock-token' },
    });

    await waitFor(() => { // Esperar la carga inicial
      expect(screen.queryByText('¿Quieres ofrecer tus servicios?')).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Conviértete en Profesional' })).not.toBeInTheDocument();
    });
  });

 // En UserDashboard.test.jsx
// Test 4: Carga y visualización de citas Pendientes
test('debe cargar y mostrar las citas pendientes', async () => {
  renderWithRouterAndContext(<UserDashboard />, {
    authProps: { user: mockUserBuscador, token: 'mock-token' },
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:8080/api/citas/buscador/${mockUserBuscador.id}`, expect.any(Object));
    // ¡CORRECCIÓN AQUÍ!
    // Queremos asegurarnos de que el botón de la pestaña esté ahí
    expect(screen.getByRole('button', { name: 'Próximas Citas' })).toBeInTheDocument();
    // Y que el encabezado H2 de la sección también
    expect(screen.getByRole('heading', { name: 'Próximas Citas' })).toBeInTheDocument();
    // Y que la cita pendiente específica se muestre
    expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument();
    expect(screen.getByText(`Proveedor: ${mockPendingBooking.serviceDetails.prestador.nombre}`)).toBeInTheDocument();
    expect(screen.getByText(mockPendingBooking.fecha)).toBeInTheDocument();
    expect(screen.getByText(mockPendingBooking.hora)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeInTheDocument();
  });
  expect(screen.queryByText('No tienes citas programadas.')).not.toBeInTheDocument();
});

  // Test 5: Visualización de mensaje cuando no hay citas pendientes
  test('debe mostrar mensaje de "No tienes citas programadas" si no hay pendientes', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/citas/buscador/')) {
        return Promise.resolve({ data: [mockCompletedBooking] }); // Solo citas completadas
      }
      if (url.includes('/api/servicios/serviceB')) {
        return Promise.resolve({ data: { nombre: 'Servicio de Plomería', prestador: { nombre: 'María González' }, foto: '/plomeria.jpg', resenas: [] } });
      }
      return Promise.reject(new Error(`URL no mockeada: ${url}`));
    });

    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText('No tienes citas programadas.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Buscar servicios' })).toHaveAttribute('href', '/search');
    });
    expect(screen.queryByText(mockPendingBooking.serviceDetails.title)).not.toBeInTheDocument();
  });

  // Test 6: Cambio de pestaña a "Completada" y visualización de citas

test('debe cambiar a la pestaña "Completada" y mostrar las citas completadas', async () => {
  renderWithRouterAndContext(<UserDashboard />, {
    authProps: { user: mockUserBuscador, token: 'mock-token' },
  });

  // Esperar que las citas iniciales carguen para que los botones de pestaña estén activos
  await waitFor(() => {
    // Usamos regex por si hay problemas de espacios, aunque aquí el título es directo
    expect(screen.getByText(/Servicio de Electricidad/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: 'Historial' }));

  await waitFor(() => {
    expect(screen.getByText('Historial de Servicios')).toBeInTheDocument();
    // Usar regex para el título de la cita por robustez
    expect(screen.getByText(/Servicio de Plomería/i)).toBeInTheDocument();

    // ¡CORRECCIÓN AQUÍ para "Completado"!
    // Como puede haber múltiples, usamos getAllByText y verificamos que al menos uno exista.
    expect(screen.getAllByText('Completado').length).toBeGreaterThan(0);
  });

  // Verificar que la cita pendiente no esté visible
  expect(screen.queryByText(/Servicio de Electricidad/i)).not.toBeInTheDocument();
});

  // En UserDashboard.test.jsx
// Test 7: Botón "Dejar Reseña" vs. "Ya has dejado una reseña"
// En UserDashboard.test.jsx
// Test 7: Botón "Dejar Reseña" si la cita no ha sido reseñada y "Ya has dejado una reseña" si sí

test('debe mostrar "Dejar Reseña" si la cita no ha sido reseñada y "Ya has dejado una reseña" si sí', async () => {
  renderWithRouterAndContext(<UserDashboard />, {
    authProps: { user: mockUserBuscador, token: 'mock-token' },
  });

  // Primero, esperar que las citas iniciales (Pendientes) carguen para que los elementos estén en el DOM
  // Aunque este test se enfoca en "Completadas", el componente hace la llamada para ambas al inicio.
  await waitFor(() => {
    expect(screen.getByText(/Servicio de Electricidad/i)).toBeInTheDocument();
  });

  // Hacer clic en la pestaña "Historial"
  fireEvent.click(screen.getByRole('button', { name: 'Historial' }));

  // ¡CORRECCIÓN CLAVE AQUÍ!
  // Esperar específicamente a que el encabezado de la sección "Historial de Servicios" aparezca.
  // Esto es un indicador más fiable de que la pestaña ha cambiado y su contenido principal está listo.
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Historial de Servicios' })).toBeInTheDocument();
  });

  // Ahora, las aserciones sobre las citas de la pestaña "Completada" deberían ser estables
  // Cita completada SIN reseñar
  const notReviewedBookingCard = screen.getByText(/Servicio de Plomería/i).closest('.border');
  expect(within(notReviewedBookingCard).getByText('Completado')).toBeInTheDocument();
  expect(within(notReviewedBookingCard).getByRole('link', { name: 'Dejar Reseña' })).toBeInTheDocument();
  expect(within(notReviewedBookingCard).getByRole('link', { name: 'Dejar Reseña' })).toHaveAttribute('href', `/crear-resena/${mockCompletedBooking.id}`);

  // Cita completada YA reseñada
  const reviewedBookingCard = screen.getByText(/Servicio de Limpieza/i).closest('.border');
  expect(within(reviewedBookingCard).getByText('Completado')).toBeInTheDocument();
  expect(within(reviewedBookingCard).getByText('Ya has dejado una reseña')).toBeInTheDocument();
  expect(within(reviewedBookingCard).queryByRole('link', { name: 'Dejar Reseña' })).not.toBeInTheDocument();
});


  // Test 8: Cancelar una cita pendiente
  test('debe cancelar una cita pendiente al hacer clic en el botón "Cancelar"', async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 }); // Mock para la llamada DELETE

    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument();
    });

    mockConfirm.mockReturnValueOnce(true); // Asegurarse de que confirm retorne true para la cancelación

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockConfirm).toHaveBeenCalledWith('¿Estás seguro de que deseas cancelar esta cita?');
      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:8080/api/citas/eliminar/${mockPendingBooking.id}`,
        { headers: { Authorization: `Bearer mock-token` } }
      );
      // La cita debería desaparecer del DOM
      expect(screen.queryByText(mockPendingBooking.serviceDetails.title)).not.toBeInTheDocument();
    });
  });

  // Test 9: No cancelar la cita si el usuario cancela la confirmación
  test('no debe cancelar la cita si el usuario cancela la confirmación', async () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument();
    });

    mockConfirm.mockReturnValueOnce(false); // Simular que el usuario cancela

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockConfirm).toHaveBeenCalledWith('¿Estás seguro de que deseas cancelar esta cita?');
      expect(axios.delete).not.toHaveBeenCalled(); // No debe intentar la llamada a la API
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument(); // La cita sigue ahí
    });
  });

  // Test 10: Contactar por WhatsApp
  test('debe abrir WhatsApp con el mensaje correcto al hacer clic en "Contactar por WhatsApp"', async () => {
    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument();
    });

    const whatsappButton = screen.getByRole('button', { name: 'Contactar por WhatsApp' });
    fireEvent.click(whatsappButton);

    const expectedNumber = mockPendingBooking.serviceDetails.prestador.numero.replace("+", "");
    const expectedMessage = encodeURIComponent(
      `Hola ${mockPendingBooking.serviceDetails.prestador.nombre}, soy ${mockUserBuscador.nombre} desde Conectados. Te escribo por el servicio ${mockPendingBooking.serviceDetails.title}.`
    );
    const expectedUrl = `https://wa.me/${expectedNumber}?text=${expectedMessage}`;

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledWith(expectedUrl, '_blank');
  });

  // Test 11: Mostrar alerta si el prestador no tiene número de WhatsApp
  test('debe mostrar una alerta si el prestador no tiene un número de WhatsApp', async () => {
    // Mockear una cita pendiente sin número de prestador
    const mockPendingBookingNoNumber = {
      ...mockPendingBooking,
      id: 'cita4',
      serviceDetails: {
        ...mockPendingBooking.serviceDetails,
        prestador: { nombre: 'Pedro SinNúmero' }, // Sin número
      },
    };

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/citas/buscador/')) {
        return Promise.resolve({ data: [mockPendingBookingNoNumber] });
      }
      if (url.includes('/api/servicios/serviceA')) {
        return Promise.resolve({ data: { nombre: 'Servicio de Electricidad', prestador: { nombre: 'Pedro SinNúmero' }, foto: '/electricista.jpg', resenas: [] } });
      }
      return Promise.reject(new Error(`URL no mockeada: ${url}`));
    });

    // Espiar window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockPendingBookingNoNumber.serviceDetails.title)).toBeInTheDocument();
    });

    const whatsappButton = screen.getByRole('button', { name: 'Contactar por WhatsApp' });
    fireEvent.click(whatsappButton);

    expect(mockAlert).toHaveBeenCalledTimes(1);
    expect(mockAlert).toHaveBeenCalledWith('Este usuario no tiene un número registrado.');
    expect(mockOpen).not.toHaveBeenCalled(); // No debe intentar abrir WhatsApp

    mockAlert.mockRestore(); // Restaurar window.alert
  });


  // Test 12: Manejo de errores al cargar citas
test('debe registrar un error en la consola si falla la carga de citas', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/api/citas/buscador/')) {
      return Promise.reject(new Error('Error de red simulado'));
    }
    // Es importante que las otras llamadas a la API de servicios si se esperan, funcionen
    // si no, el test puede fallar por otro lado.
    // En este test en particular, no se deberían llamar a los servicios
    // porque la primera llamada a citas fallaría.
    return Promise.reject(new Error(`URL no mockeada o error inesperado: ${url}`));
  });

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  renderWithRouterAndContext(<UserDashboard />, {
    authProps: { user: mockUserBuscador, token: 'mock-token' },
  });

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al cargar citas:', expect.any(Error));
  });

  // Aserciones corregidas:
  // El botón "Próximas Citas" SIEMPRE se renderiza.
  expect(screen.getByRole('button', { name: 'Próximas Citas' })).toBeInTheDocument();
  // El H2 "Próximas Citas" SIEMPRE se renderiza si la pestaña 'Pendiente' está activa (que es por defecto)
  expect(screen.getByRole('heading', { name: 'Próximas Citas' })).toBeInTheDocument();

  // Lo que NO debería estar presente es una cita real (usando el título de una cita de ejemplo)
  expect(screen.queryByText(mockPendingBooking.serviceDetails.title)).not.toBeInTheDocument();

  // Y SÍ debería estar presente el mensaje de "No tienes citas programadas."
  expect(screen.getByText('No tienes citas programadas.')).toBeInTheDocument();

  consoleErrorSpy.mockRestore();
});

  // Test 13: Manejo de errores al cancelar citas
  test('debe mostrar una alerta de error si falla la cancelación de una cita', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Fallo al eliminar cita'));

    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouterAndContext(<UserDashboard />, {
      authProps: { user: mockUserBuscador, token: 'mock-token' },
    });

    await waitFor(() => {
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith('No se pudo cancelar la cita. Intenta nuevamente.');
      expect(screen.getByText(mockPendingBooking.serviceDetails.title)).toBeInTheDocument(); // La cita debe seguir visible
    });

    mockAlert.mockRestore();
  });
});