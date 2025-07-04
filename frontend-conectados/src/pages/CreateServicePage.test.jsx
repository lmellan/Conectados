import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CreateServicePage from '../pages/CreateServicePage'; // Ajusta la ruta a tu componente

// --- Mocks (Simulaciones de Dependencias) ---

// Mock de react-router-dom para controlar la navegación
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

// Mock de axios para interceptar llamadas a la API
jest.mock('axios');

// Mock del Contexto de Autenticación
let mockAuthContextValue = {};
jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue,
}));

// Mock de FileReader para simular la lectura de archivos de imagen
class MockFileReader {
  constructor() {
    this.onloadend = null;
    this.result = 'data:image/png;base64,mockImageData';
    
    // Convertimos readAsDataURL en un spy (`jest.fn()`) que mantiene la lógica original
    this.readAsDataURL = jest.fn((file) => {
      act(() => {
        if (this.onloadend) {
          this.onloadend({ target: { result: this.result } });
        }
      });
    });
  }
}
const FileReaderSpy = jest.spyOn(window, 'FileReader').mockImplementation(() => new MockFileReader());
// ---

// Silenciamos los console.error para que no ensucien la salida del test
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Función auxiliar para renderizar el componente con los contextos necesarios
const renderWithRouterAndAuth = (ui, { authProps, ...renderOptions } = {}) => {
  mockAuthContextValue = authProps;
  return render(
    <BrowserRouter>{ui}</BrowserRouter>,
    renderOptions
  );
};

// --- Datos de Prueba ---
const mockUser = { id: 'user123', nombre: 'Test Prestador', token: 'mock-token-123' };


// --- Suite de Tests para la Página de Creación de Servicio ---
describe('Página de Creación de Servicio (CreateServicePage)', () => {
  
  beforeEach(() => {
    // Limpiamos todos los mocks antes de cada test
    jest.clearAllMocks();
    axios.post.mockReset();
    FileReaderSpy.mockClear().mockImplementation(() => new MockFileReader());
  });

  afterAll(() => {
    // Restauramos console.error al final de todos los tests
    consoleErrorSpy.mockRestore();
  });

  test('no debería renderizar el formulario si el usuario no ha iniciado sesión', () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: null, token: null } });
    expect(screen.queryByText('Crear Nuevo Servicio')).not.toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  test('debería renderizar todos los campos del formulario y los botones', () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });
    expect(screen.getByText('Crear Nuevo Servicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagen del servicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Título del servicio *')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoría *')).toBeInTheDocument();
    expect(screen.getByLabelText('Zona de atención *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción *')).toBeInTheDocument();
    expect(screen.getByLabelText('Precio por hora (CLP) *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Servicio' })).toBeInTheDocument();
  });

  test('debería actualizar el estado de los campos de texto al recibir entrada', () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    const titleInput = screen.getByLabelText('Título del servicio *');
    fireEvent.change(titleInput, { target: { value: 'Clases de Guitarra' } });
    expect(titleInput).toHaveValue('Clases de Guitarra');

    const descriptionTextarea = screen.getByLabelText('Descripción *');
    fireEvent.change(descriptionTextarea, { target: { value: 'Enseño a tocar guitarra desde cero.' } });
    expect(descriptionTextarea).toHaveValue('Enseño a tocar guitarra desde cero.');

    const priceInput = screen.getByLabelText('Precio por hora (CLP) *');
    fireEvent.change(priceInput, { target: { value: '15000' } });
    expect(priceInput).toHaveValue(15000);
  });

  test('debería actualizar el estado de los campos de selección al elegir una opción', () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    const categorySelect = screen.getByLabelText('Categoría *');
    fireEvent.change(categorySelect, { target: { value: 'Electricidad' } });
    expect(categorySelect).toHaveValue('Electricidad');

    const zoneSelect = screen.getByLabelText('Zona de atención *');
    fireEvent.change(zoneSelect, { target: { value: 'Valparaíso' } });
    expect(zoneSelect).toHaveValue('Valparaíso');
  });

  test('debería mostrar la vista previa de la imagen cuando se selecciona un archivo', async () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    const fileInput = screen.getByLabelText('Imagen del servicio');
    const file = new File(['contenido falso'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const mockReaderInstance = FileReaderSpy.mock.results[0].value;
      expect(mockReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
      const previewImage = screen.getByAltText('Vista previa');
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute('src', 'data:image/png;base64,mockImageData');
    });
  });

  test('debería mostrar errores de validación para campos requeridos al enviar el formulario vacío', async () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Servicio' }));

    await waitFor(() => {
      expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
      // Podrías agregar más verificaciones de errores de validación aquí
    });
    
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('debería mostrar un error si el precio no es un número positivo', async () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    // Rellenamos todos los campos excepto el precio, que ponemos inválido
    fireEvent.change(screen.getByLabelText('Precio por hora (CLP) *'), { target: { value: '-100' } });
    fireEvent.change(screen.getByLabelText('Título del servicio *'), { target: { value: 'Servicio Válido' } });
    fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Electricidad' } });
    fireEvent.change(screen.getByLabelText('Descripción *'), { target: { value: 'Descripción Válida' } });
    fireEvent.change(screen.getByLabelText('Zona de atención *'), { target: { value: 'Valparaíso' } });

    fireEvent.click(screen.getByRole('button', { name: 'Crear Servicio' }));

    await waitFor(() => {
      expect(screen.getByText('El precio debe ser un número positivo')).toBeInTheDocument();
    });
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('debería enviar el formulario exitosamente y navegar al panel de control', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    // Rellenamos el formulario con datos válidos
    fireEvent.change(screen.getByLabelText('Título del servicio *'), { target: { value: 'Servicio de Carpintería' } });
    fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Carpintería' } });
    fireEvent.change(screen.getByLabelText('Descripción *'), { target: { value: 'Muebles a medida.' } });
    fireEvent.change(screen.getByLabelText('Precio por hora (CLP) *'), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText('Zona de atención *'), { target: { value: 'Región Metropolitana' } });
    
    const submitButton = screen.getByRole('button', { name: 'Crear Servicio' });
    fireEvent.click(submitButton);
    
    // Esperamos a que se muestre el estado de "cargando"
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Creando...');
      expect(submitButton).toBeDisabled();
    });

    // Esperamos a que la llamada a la API y la navegación se completen
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/servicios/crear',
        expect.any(Object), // Podríamos ser más específicos aquí si quisiéramos
        expect.any(Object)
      );
      expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Verificamos que el botón vuelve a su estado normal
    expect(submitButton).toHaveTextContent('Crear Servicio');
    expect(submitButton).not.toBeDisabled();
  });

  test('debería mostrar un mensaje de error si la creación del servicio falla en la API', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Error simulado del servidor' } },
    });
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });

    // Rellenamos el formulario para poder enviarlo
    fireEvent.change(screen.getByLabelText('Título del servicio *'), { target: { value: 'Servicio que Fallará' } });
    fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Electricidad' } });
    fireEvent.change(screen.getByLabelText('Descripción *'), { target: { value: 'Esto va a fallar.' } });
    fireEvent.change(screen.getByLabelText('Precio por hora (CLP) *'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Zona de atención *'), { target: { value: 'Región Metropolitana' } });

    fireEvent.click(screen.getByRole('button', { name: 'Crear Servicio' }));

    await waitFor(() => {
      expect(screen.getByText('Error simulado del servidor')).toBeInTheDocument();
    });

    // El botón debe volver a estar activo
    const submitButton = screen.getByRole('button', { name: 'Crear Servicio' });
    expect(submitButton).not.toBeDisabled();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  test('el botón Cancelar debería navegar al panel de control', () => {
    renderWithRouterAndAuth(<CreateServicePage />, { authProps: { user: mockUser, token: mockUser.token } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
  });
});