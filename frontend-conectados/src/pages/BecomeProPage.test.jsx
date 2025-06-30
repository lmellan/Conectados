import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BecomeProPage from './BecomeProPage'; // Ajusta la ruta a tu componente de página
import { AuthContext } from '../context/AuthContext'; // Asegúrate de exportar AuthContext

// --- Mocks Esenciales ---

// Mock de useNavigate
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantiene otras exportaciones reales
  useNavigate: () => mockedUseNavigate, // Sobrescribe useNavigate
}));

// Mock de axios
jest.mock('axios');

// Mock de AuthContext
// Usaremos un mock en cada test para controlar el valor de user y token
const mockLogin = jest.fn();
const mockUser = { correo: 'test@example.com' };
const mockToken = 'mock-token-123';

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>,
    renderOptions
  );
};

// --- Suites de Pruebas ---

describe('BecomeProPage', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test para asegurar aislamiento
    jest.clearAllMocks();
  });

  // Test 1: Renderizado inicial de la página y sus elementos clave
  test('debe renderizar todos los elementos clave del formulario', () => {
    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    // Encabezados
    expect(screen.getByText('Completa tu Perfil Profesional')).toBeInTheDocument();
    expect(screen.getByText('Añade tus detalles para empezar a ofrecer servicios en Conectados.')).toBeInTheDocument();

    // Campos de formulario
    // En BecomeProPage.test.jsx
    expect(screen.getByText('Categorías de servicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Zona de atención')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe tu experiencia...')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad Semanal')).toBeInTheDocument();
    expect(screen.getByLabelText('Hora de Inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Hora de Fin')).toBeInTheDocument();

    // Botón de envío
    expect(screen.getByRole('button', { name: 'Completar Perfil y Ofrecer Servicios' })).toBeInTheDocument();
  });

  // Test 2: Actualización de los campos de texto/select
  test('debe actualizar los valores de los campos de texto y select al escribir/seleccionar', () => {
    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    const descripcionInput = screen.getByPlaceholderText('Describe tu experiencia...');
    fireEvent.change(descripcionInput, { target: { value: 'Experiencia probando componentes de React.' } });
    expect(descripcionInput).toHaveValue('Experiencia probando componentes de React.');

    const zonaAtencionSelect = screen.getByLabelText('Zona de atención');
    fireEvent.change(zonaAtencionSelect, { target: { value: 'Región Metropolitana' } });
    expect(zonaAtencionSelect).toHaveValue('Región Metropolitana');

    const horaInicioInput = screen.getByLabelText('Hora de Inicio');
    fireEvent.change(horaInicioInput, { target: { value: '10:00' } });
    expect(horaInicioInput).toHaveValue('10:00');
  });

  // Test 3: Selección y deselección de categorías y días de disponibilidad
  test('debe permitir seleccionar y deseleccionar categorías y días de disponibilidad', () => {
    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    const plomeroCheckbox = screen.getByLabelText('Plomero');
    fireEvent.click(plomeroCheckbox);
    expect(plomeroCheckbox).toBeChecked();
    fireEvent.click(plomeroCheckbox); // Deseleccionar
    expect(plomeroCheckbox).not.toBeChecked();

    const lunesCheckbox = screen.getByLabelText('Lunes');
    fireEvent.click(lunesCheckbox);
    expect(lunesCheckbox).toBeChecked();
    const martesCheckbox = screen.getByLabelText('Martes');
    fireEvent.click(martesCheckbox);
    expect(martesCheckbox).toBeChecked();

    fireEvent.click(lunesCheckbox); // Deseleccionar Lunes
    expect(lunesCheckbox).not.toBeChecked();
    expect(martesCheckbox).toBeChecked(); // Martes debe seguir seleccionado
  });

  // Test 4: Envío exitoso del formulario
  test('debe enviar el formulario exitosamente y navegar al dashboard', async () => {
    axios.put.mockResolvedValueOnce({ data: { user: { correo: 'test@example.com', isProfessional: true } } });

    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    // Rellenar campos necesarios
    fireEvent.change(screen.getByPlaceholderText('Describe tu experiencia...'), { target: { value: 'Soy un gran profesional.' } });
    fireEvent.change(screen.getByLabelText('Zona de atención'), { target: { value: 'Región Metropolitana' } });
    fireEvent.click(screen.getByLabelText('Electricista')); // Seleccionar categoría
    fireEvent.click(screen.getByLabelText('Lunes')); // Seleccionar disponibilidad

    const submitButton = screen.getByRole('button', { name: 'Completar Perfil y Ofrecer Servicios' });
    fireEvent.click(submitButton);

    // Verificar estado de carga
    expect(submitButton).toHaveTextContent('Guardando...');
    expect(submitButton).toBeDisabled();

    // Esperar a que la operación asíncrona se complete
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/usuarios/test@example.com/add-professional-details',
        expect.objectContaining({
          categoria: ['Electricista'],
          descripcion: 'Soy un gran profesional.',
          zonaAtencion: 'Región Metropolitana',
          disponibilidad: ['Lunes'],
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
      expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Verificar estado final del botón
    expect(submitButton).toHaveTextContent('Completar Perfil y Ofrecer Servicios');
    expect(submitButton).not.toBeDisabled();
  });

  // Test 5: Manejo de error si el usuario no está identificado
  test('debe mostrar un error si el usuario no está identificado (user.correo es nulo)', async () => {
    renderWithContext(<BecomeProPage />, {
      providerProps: { user: { correo: null }, token: mockToken, login: mockLogin }, // Simular usuario sin correo
    });

    // Rellenar campos necesarios para pasar otras validaciones
    fireEvent.change(screen.getByPlaceholderText('Describe tu experiencia...'), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText('Zona de atención'), { target: { value: 'Región Metropolitana' } });
    fireEvent.click(screen.getByLabelText('Electricista'));
    fireEvent.click(screen.getByLabelText('Lunes'));

    fireEvent.click(screen.getByRole('button', { name: 'Completar Perfil y Ofrecer Servicios' }));

    await waitFor(() => {
      expect(screen.getByText('No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.')).toBeInTheDocument();
      expect(axios.put).not.toHaveBeenCalled(); // No debe intentar la llamada a la API
      expect(mockedUseNavigate).not.toHaveBeenCalled(); // No debe navegar
    });
  });

  // Test 6: Manejo de error si faltan categorías o días de disponibilidad
  test('debe mostrar un error si no se selecciona categoría o disponibilidad', async () => {
    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    // No seleccionar categoría ni disponibilidad
    fireEvent.change(screen.getByPlaceholderText('Describe tu experiencia...'), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText('Zona de atención'), { target: { value: 'Región Metropolitana' } });

    fireEvent.click(screen.getByRole('button', { name: 'Completar Perfil y Ofrecer Servicios' }));

    await waitFor(() => {
      expect(screen.getByText('Debes seleccionar al menos una categoría y un día de disponibilidad.')).toBeInTheDocument();
      expect(axios.put).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  // Test 7: Manejo de error en la llamada a la API
  test('debe mostrar un mensaje de error si la llamada a la API falla', async () => {
    axios.put.mockRejectedValueOnce({ response: { data: { message: 'Error de servidor simulado' } } });

    renderWithContext(<BecomeProPage />, {
      providerProps: { user: mockUser, token: mockToken, login: mockLogin },
    });

    // Rellenar campos para pasar validaciones
    fireEvent.change(screen.getByPlaceholderText('Describe tu experiencia...'), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText('Zona de atención'), { target: { value: 'Región Metropolitana' } });
    fireEvent.click(screen.getByLabelText('Plomero'));
    fireEvent.click(screen.getByLabelText('Martes'));

    const submitButton = screen.getByRole('button', { name: 'Completar Perfil y Ofrecer Servicios' });
    fireEvent.click(submitButton);

    // Verificar estado de carga
    expect(submitButton).toHaveTextContent('Guardando...');
    expect(submitButton).toBeDisabled();

    // Esperar el error de la API
    await waitFor(() => {
      expect(screen.getByText('Error de servidor simulado')).toBeInTheDocument();
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(mockedUseNavigate).not.toHaveBeenCalled(); // No debe navegar
    });

    // Verificar que el botón vuelva a su estado original
    expect(submitButton).toHaveTextContent('Completar Perfil y Ofrecer Servicios');
    expect(submitButton).not.toBeDisabled();
  });
});