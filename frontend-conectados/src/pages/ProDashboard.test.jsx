import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProDashboard from './ProDashboard';
import '@testing-library/jest-dom';

// --- Mocks de Dependencias Externas ---

jest.mock('axios');

// Mock de Componentes Hijos para aislar las pruebas
jest.mock('../components/ConfirmationModal', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ onConfirm, onCancel, title, message }) => (
    <div data-testid="mock-confirmation-modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
});

jest.mock('../components/RescheduleAppointmentModal', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ booking, onClose }) => (
    <div data-testid="mock-reschedule-modal">
      <h3>Reprogramar Cita: {booking.serviceDetails.title}</h3>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
});

// --- Datos de Prueba ---

const mockUser = {
  id: 'prestador-1',
  nombre: 'Juan El Gasfiter',
  correo: 'juan.gasfiter@example.com',
  rolActivo: 'PRESTADOR',
  foto: 'https://example.com/juan.jpg',
  disponibilidad: ["Lunes", "Miércoles"],
  horaInicio: "09:00",
  horaFin: "17:00",
};

const mockToken = 'jwt-test-token';

const mockProServices = [
  { id: 'servicio-A', nombre: 'Reparación de Fugas', categoria: 'Plomería', precio: 30000, foto: 'servicio-a.jpg' },
  { id: 'servicio-B', nombre: 'Instalación de Grifería', categoria: 'Plomería', precio: 50000, foto: 'servicio-b.jpg' },
];

const mockBookings = [
  // Cita Pendiente
  { id: 'cita-1', idServicio: 'servicio-A', idBuscador: 'cliente-101', fecha: '2025-08-15', hora: '10:00', estado: 'Pendiente' },
  // Cita Completada
  { id: 'cita-2', idServicio: 'servicio-B', idBuscador: 'cliente-102', fecha: '2025-07-20', hora: '14:00', estado: 'Completada' },
];

const mockServiceDetails = {
  'servicio-A': { nombre: 'Reparación de Fugas', foto: 'servicio-a.jpg' },
  'servicio-B': { nombre: 'Instalación de Grifería', foto: 'servicio-b.jpg' },
};

const mockClientDetails = {
  'cliente-101': { nombre: 'Ana Cliente', imagen: 'ana.jpg', numero: '+56911112222' },
  'cliente-102': { nombre: 'Pedro Cliente', imagen: 'pedro.jpg' },
};


// --- Helper de Renderizado ---
const renderProDashboard = (user, token) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user, token }}>
        <ProDashboard />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

// --- Suite de Tests para el Panel de Profesional ---
describe('Panel de Profesional (ProDashboard)', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de la llamada principal a la API para cargar todos los datos
    axios.get.mockImplementation((url) => {
      if (url.includes(`/servicios/prestador/${mockUser.id}`)) {
        return Promise.resolve({ data: mockProServices });
      }
      if (url.includes(`/citas/prestador/${mockUser.id}`)) {
        return Promise.resolve({ data: mockBookings });
      }
      // Mocks para los detalles de cada cita
      const serviceId = url.match(/api\/servicios\/(servicio-[A-Z])$/)?.[1];
      if (serviceId) {
        return Promise.resolve({ data: mockServiceDetails[serviceId] });
      }
      const clientId = url.match(/api\/usuarios\/id\/(cliente-\d+)$/)?.[1];
      if (clientId) {
        return Promise.resolve({ data: mockClientDetails[clientId] });
      }
      return Promise.reject(new Error(`URL no simulada: ${url}`));
    });
  });

  test('debería mostrar "Acceso denegado" si el usuario no es un prestador', () => {
    const nonProUser = { ...mockUser, rolActivo: 'BUSCADOR' };
    renderProDashboard(nonProUser, mockToken);
    expect(screen.getByText(/Acceso denegado/i)).toBeInTheDocument();
  });

  test('debería cargar y mostrar los servicios del profesional en la pestaña por defecto', async () => {
    renderProDashboard(mockUser, mockToken);
    
    // Esperamos a que uno de los servicios aparezca en la pantalla
    expect(await screen.findByText('Reparación de Fugas')).toBeInTheDocument();
    expect(screen.getByText('Instalación de Grifería')).toBeInTheDocument();
    
    // Verificamos que se hicieron las llamadas correctas para cargar los datos
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/servicios/prestador/${mockUser.id}`), expect.any(Object));
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/citas/prestador/${mockUser.id}`), expect.any(Object));
  });

  test('debería cambiar a la pestaña de citas y mostrar las citas pendientes', async () => {
    renderProDashboard(mockUser, mockToken);
    await screen.findByText('Reparación de Fugas'); // Esperamos a que carguen los datos iniciales

    // Cambiamos de pestaña
    const bookingsTab = screen.getByRole('button', { name: 'Citas Programadas' });
    fireEvent.click(bookingsTab);

    // Verificamos que el contenido de la nueva pestaña sea visible
    expect(await screen.findByRole('heading', { name: 'Citas Programadas' })).toBeInTheDocument();
    expect(screen.getByText(/Cliente: Ana Cliente/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cliente: Pedro Cliente/i)).not.toBeInTheDocument(); // La cita completada no debe estar aquí
  });

  test('debería cambiar a la pestaña de historial y mostrar las citas completadas', async () => {
    renderProDashboard(mockUser, mockToken);
    await screen.findByText('Reparación de Fugas');

    const historyTab = screen.getByRole('button', { name: 'Historial' });
    fireEvent.click(historyTab);

    expect(await screen.findByRole('heading', { name: 'Historial de Servicios' })).toBeInTheDocument();
    expect(screen.getByText(/Cliente: Pedro Cliente/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cliente: Ana Cliente/i)).not.toBeInTheDocument(); // La cita pendiente no debe estar aquí
  });

  
    test('debería abrir el modal de confirmación y eliminar un servicio al confirmar', async () => {
  // --- Preparamos los datos para el test ---
  const servicioAEliminar = mockProServices[0];
  const serviciosDespuesDeEliminar = mockProServices.filter(s => s.id !== servicioAEliminar.id);

  // --- 1. Mock para la CARGA INICIAL de datos ---
  // Se simulan todas las llamadas que hará `loadProData` la primera vez.
  axios.get
    .mockResolvedValueOnce({ data: mockProServices }) // Lista completa de servicios
    .mockResolvedValueOnce({ data: mockBookings })    // Lista de citas
    // Detalles para la primera cita
    .mockResolvedValueOnce({ data: mockServiceDetails[mockBookings[0].idServicio] })
    .mockResolvedValueOnce({ data: mockClientDetails[mockBookings[0].idBuscador] })
    // Detalles para la segunda cita
    .mockResolvedValueOnce({ data: mockServiceDetails[mockBookings[1].idServicio] })
    .mockResolvedValueOnce({ data: mockClientDetails[mockBookings[1].idBuscador] });
  
  // Mock para la llamada de eliminación
  axios.delete.mockResolvedValueOnce({ status: 200 });

  // --- 2. Mock para la RECARGA de datos (después de eliminar) ---
  // Se encadenan las respuestas para la segunda ejecución de `loadProData`.
  axios.get
    .mockResolvedValueOnce({ data: serviciosDespuesDeEliminar }) // <-- La diferencia clave: devuelve la lista filtrada.
    .mockResolvedValueOnce({ data: mockBookings })
    .mockResolvedValueOnce({ data: mockServiceDetails[mockBookings[0].idServicio] })
    .mockResolvedValueOnce({ data: mockClientDetails[mockBookings[0].idBuscador] })
    .mockResolvedValueOnce({ data: mockServiceDetails[mockBookings[1].idServicio] })
    .mockResolvedValueOnce({ data: mockClientDetails[mockBookings[1].idBuscador] });

  renderProDashboard(mockUser, mockToken);

  // Esperamos a que los servicios iniciales se rendericen
  const deleteButtons = await screen.findAllByRole('button', { name: 'Eliminar' });
  expect(screen.getByText(servicioAEliminar.nombre)).toBeInTheDocument();

  // Hacemos clic en el botón de eliminar
  fireEvent.click(deleteButtons[0]);

  // Verificamos que el modal de confirmación aparece
  await screen.findByTestId('mock-confirmation-modal');
  const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
  
  // Hacemos clic en confirmar
  fireEvent.click(confirmButton);

  // Esperamos y verificamos que la llamada DELETE se realizó
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      `http://localhost:8080/api/servicios/eliminar/${servicioAEliminar.id}`,
      expect.any(Object)
    );
  });
  
  // Verificamos el resultado final: el servicio ya NO está en el DOM
  await waitFor(() => {
    expect(screen.queryByText(servicioAEliminar.nombre)).not.toBeInTheDocument();
  });

  // Verificamos que el otro servicio sigue ahí
  expect(screen.getByText('Instalación de Grifería')).toBeInTheDocument();
});

  test('debería abrir el modal de reprogramación al hacer clic en "Reprogramar"', async () => {
    renderProDashboard(mockUser, mockToken);
    await screen.findByText('Reparación de Fugas');
    
    // Cambiamos a la pestaña de citas
    fireEvent.click(screen.getByRole('button', { name: 'Citas Programadas' }));

    // Hacemos clic en el botón de reprogramar
    const rescheduleButton = await screen.findByRole('button', { name: 'Reprogramar' });
    fireEvent.click(rescheduleButton);

    // Verificamos que el modal de reprogramación aparece
    const rescheduleModal = await screen.findByTestId('mock-reschedule-modal');
    expect(rescheduleModal).toBeInTheDocument();
    // Verificamos que se le pasaron los datos correctos al modal (usando su contenido simulado)
    expect(screen.getByText('Reprogramar Cita: Reparación de Fugas')).toBeInTheDocument();
  });
});