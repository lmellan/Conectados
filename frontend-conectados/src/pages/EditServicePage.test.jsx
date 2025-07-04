import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EditServicePage from './EditServicePage'; // Ajusta la ruta a tu componente

// --- Mocks (Simulaciones de Dependencias) ---

// Mock de react-router-dom para controlar la navegación y los parámetros
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useParams: () => ({ id: 'servicio123' }), // Usamos un ID de servicio fijo para los tests
}));

// Mock del objeto fetch global para interceptar llamadas a la API
global.fetch = jest.fn();

// Mock de FileReader para simular la lectura de archivos de imagen
class MockFileReader {
  constructor() {
    this.onloadend = null;
    this.result = 'data:image/jpeg;base64,newMockImageData';
    this.readAsDataURL = jest.fn(() => {
      act(() => {
        if (this.onloadend) {
          this.onloadend({ target: { result: this.result } });
        }
      });
    });
  }
}
const FileReaderSpy = jest.spyOn(window, 'FileReader').mockImplementation(() => new MockFileReader());


// --- Datos de Prueba ---
const mockUser = { id: 'prestador456', rolActivo: 'PRESTADOR' };
const mockServiceData = {
  id: 'servicio123',
  nombre: 'Servicio de Plomería Inicial',
  categoria: 'Plomería',
  descripcion: 'Arreglos de cañerías y grifos.',
  precio: 25000,
  zonaAtencion: 'Valparaíso',
  foto: 'data:image/png;base64,initialMockImageData',
  prestador: { id: 'prestador456' }, // El ID coincide con mockUser
};
const unauthorizedServiceData = { ...mockServiceData, prestador: { id: 'otroUsuario789' } };


// --- Helper de Renderizado ---
// Función auxiliar para renderizar el componente con los contextos necesarios
const renderComponent = (user) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user }}>
        <EditServicePage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};


// --- Suite de Tests para EditServicePage ---
describe('Página de Edición de Servicio (EditServicePage)', () => {

  beforeEach(() => {
    // Limpiamos todos los mocks antes de cada test para asegurar el aislamiento
    jest.clearAllMocks();
    global.fetch.mockClear();
    FileReaderSpy.mockClear().mockImplementation(() => new MockFileReader());
  });

  test('debería mostrar el estado de carga inicialmente', () => {
    renderComponent(mockUser);
    expect(screen.getByText('Cargando datos del servicio...')).toBeInTheDocument();
  });

  test('debería obtener los datos del servicio y rellenar el formulario en el renderizado inicial', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServiceData,
    });

    renderComponent(mockUser);

    // Esperamos a que el formulario aparezca (después de que "Cargando..." desaparezca)
    const heading = await screen.findByRole('heading', { name: 'Editar Servicio' });
    expect(heading).toBeInTheDocument();

    // Verificamos que los campos se llenaron con los datos del mock
    expect(screen.getByLabelText('Título del servicio *')).toHaveValue(mockServiceData.nombre);
    expect(screen.getByLabelText('Categoría *')).toHaveValue(mockServiceData.categoria);
    expect(screen.getByLabelText('Descripción *')).toHaveValue(mockServiceData.descripcion);
    expect(screen.getByLabelText(/Precio por hora/)).toHaveValue(mockServiceData.precio);
    expect(screen.getByLabelText('Zona de atención *')).toHaveValue(mockServiceData.zonaAtencion);
    expect(screen.getByAltText('Vista previa')).toHaveAttribute('src', mockServiceData.foto);
  });

  test('debería redirigir si el usuario identificado no es el propietario del servicio', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => unauthorizedServiceData, // Usamos datos de un servicio ajeno
    });
    
    renderComponent(mockUser);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/pro-dashboard');
    });
  });

  test('debería manejar un error de carga (fetch) y redirigir', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    renderComponent(mockUser);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/pro-dashboard');
    });
  });

  test('debería actualizar los campos del formulario al recibir entrada del usuario', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    renderComponent(mockUser);
    await screen.findByRole('heading', { name: 'Editar Servicio' });

    const titleInput = screen.getByLabelText('Título del servicio *');
    fireEvent.change(titleInput, { target: { value: 'Nuevo Título del Servicio' } });
    expect(titleInput).toHaveValue('Nuevo Título del Servicio');
  });

  test('debería mostrar la nueva vista previa de la imagen cuando se selecciona un archivo', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    renderComponent(mockUser);
    await screen.findByRole('heading', { name: 'Editar Servicio' });

    const fileInput = screen.getByLabelText('Cambiar imagen');
    const newImageFile = new File(['new-image'], 'new-image.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [newImageFile] } });

    await waitFor(() => {
      expect(screen.getByText(newImageFile.name)).toBeInTheDocument();
      expect(screen.getByAltText('Vista previa')).toHaveAttribute('src', 'data:image/jpeg;base64,newMockImageData');
    });
  });

  test('debería mostrar errores de validación al enviar un formulario inválido', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    renderComponent(mockUser);
    await screen.findByRole('heading', { name: 'Editar Servicio' });

    fireEvent.change(screen.getByLabelText('Título del servicio *'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1); // Solo la llamada inicial, no la de actualización
  });

  test('debería enviar los datos actualizados del formulario y navegar exitosamente', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Servicio actualizado' }) });

    renderComponent(mockUser);
    await screen.findByRole('heading', { name: 'Editar Servicio' });

    fireEvent.change(screen.getByLabelText('Título del servicio *'), { target: { value: 'Título Actualizado' } });
    fireEvent.change(screen.getByLabelText('Precio por hora (CLP) *'), { target: { value: '30000' } });

    const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardando...');
    });
    
    const expectedPayload = {
      nombre: 'Título Actualizado',
      categoria: mockServiceData.categoria,
      descripcion: mockServiceData.descripcion,
      precio: 30000,
      zonaAtencion: mockServiceData.zonaAtencion,
      foto: mockServiceData.foto,
    };

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(
        'http://localhost:8080/api/servicios/actualizar/servicio123',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expectedPayload),
        })
      );
    });

    expect(mockedUseNavigate).toHaveBeenCalledWith('/pro-dashboard');
  });

  test('debería navegar al panel de control al hacer clic en el botón Cancelar', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServiceData });
    renderComponent(mockUser);
    await screen.findByRole('heading', { name: 'Editar Servicio' });

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/pro-dashboard');
  });
});