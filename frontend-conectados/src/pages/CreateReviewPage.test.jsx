import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreateReviewPage from './CreateReviewPage';
import '@testing-library/jest-dom';

// --- Mocks de Dependencias ---

// Mock de react-router-dom
const mockedUseNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useParams: () => mockUseParams(),
}));

// Mock del API fetch global
global.fetch = jest.fn();


// --- Datos de Prueba ---
const mockUser = { id: 'user-buscador-1', rol: 'BUSCADOR' };
const mockCita = {
  id: 'cita-abc-123',
  idServicio: 'servicio-xyz-456',
  idBuscador: 'user-buscador-1',
  idPrestador: 'user-prestador-789',
};
const MOCK_DATE = '2025-07-01'; // Fecha fija para los tests


// --- Helper de Renderizado ---
const renderCreateReviewPage = (user) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user }}>
        <CreateReviewPage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};


// --- Suite de Tests para la Página de Creación de Reseña ---
describe('Página de Creación de Reseña (CreateReviewPage)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Proveemos un ID de cita por defecto para la mayoría de los tests
    mockUseParams.mockReturnValue({ idCita: 'cita-abc-123' });
    // Simulamos la carga inicial de los datos de la cita
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCita,
    });
    // Controlamos la fecha para que 'new Date()' sea predecible
    jest.useFakeTimers().setSystemTime(new Date(MOCK_DATE));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debería mostrar "Cargando..." mientras se obtienen los datos de la cita', () => {
    renderCreateReviewPage(mockUser);
    expect(screen.getByText('Cargando datos de la cita...')).toBeInTheDocument();
  });

  test('debería mostrar el formulario después de cargar los datos de la cita', async () => {
    renderCreateReviewPage(mockUser);
    expect(await screen.findByRole('heading', { name: 'Dejar Reseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Comentario *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar Reseña' })).toBeInTheDocument();
  });

  test('debería redirigir si el usuario no tiene el rol de "BUSCADOR"', () => {
    const prestadorUser = { id: 'prestador-1', rol: 'PRESTADOR' };
    renderCreateReviewPage(prestadorUser);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
  });

  test('debería actualizar la valoración al hacer clic en las estrellas', async () => {
    renderCreateReviewPage(mockUser);
    await screen.findByRole('heading', { name: 'Dejar Reseña' });

    // En el componente, hay 5 estrellas, cada una con una parte "media" y una "completa".
    // Esto resulta en 10 spans clickeables. Vamos a buscarlos todos.
    const starSpans = screen.getByText('Valoración *').parentElement.querySelectorAll('span[role="button"]');
    
    // El 7º span corresponde a la parte completa de la 4ª estrella (valoración 8/10)
    // Indices: 0(media 1), 1(completa 1), 2(media 2), 3(completa 2)... 6(media 4), 7(completa 4)
    expect(starSpans).toHaveLength(10);
    fireEvent.click(starSpans[7]);
    
    // Verificamos que el puntaje mostrado se actualiza
    expect(await screen.findByText('Puntaje: 8/10')).toBeInTheDocument();
  });

  test('debería mostrar errores de validación si el formulario está incompleto', async () => {
    renderCreateReviewPage(mockUser);
    await screen.findByRole('heading', { name: 'Dejar Reseña' });

    // Hacemos clic en enviar sin rellenar nada
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Reseña' }));
    
    // Verificamos que aparecen los mensajes de error
    expect(await screen.findByText('Debe ser un número entre 1 y 10')).toBeInTheDocument();
    expect(screen.getByText('El comentario es obligatorio')).toBeInTheDocument();

    // Verificamos que no se intentó enviar la reseña (solo se llamó a fetch 1 vez para cargar la cita)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('debería enviar la reseña y navegar al dashboard exitosamente', async () => {
    // La primera llamada (GET) ya está simulada en beforeEach.
    // Ahora simulamos la segunda llamada (POST).
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCita }) // Carga de cita
                 .mockResolvedValueOnce({ ok: true }); // Envío de reseña

    renderCreateReviewPage(mockUser);
    await screen.findByRole('heading', { name: 'Dejar Reseña' });
    
    // Rellenamos el formulario
    const starSpans = screen.getByText('Valoración *').parentElement.querySelectorAll('span[role="button"]');
    fireEvent.click(starSpans[9]); // 10/10 puntos (5ª estrella completa)
    fireEvent.change(screen.getByLabelText('Comentario *'), { target: { value: 'Un servicio realmente increíble.' } });
    
    // Hacemos clic en enviar
    const submitButton = screen.getByRole('button', { name: 'Enviar Reseña' });
    fireEvent.click(submitButton);

    // Esperamos a que el botón muestre el estado de carga
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Enviando...');
    });
    
    // Verificamos que la llamada POST se hizo con los datos correctos
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/resenas/crear',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            citaId: mockCita.id,
            servicioId: mockCita.idServicio,
            buscadorId: mockCita.idBuscador,
            prestadorId: mockCita.idPrestador,
            comentario: 'Un servicio realmente increíble.',
            valoracion: 10,
            fecha: MOCK_DATE,
          })
        })
      );
    });

    // Verificamos la navegación final
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/user-dashboard');
    });
  });

  test('debería manejar un error si la API falla al crear la reseña', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCita }) // Carga de cita
                 .mockResolvedValueOnce({ ok: false }); // Falla al enviar la reseña
    
    renderCreateReviewPage(mockUser);
    await screen.findByRole('heading', { name: 'Dejar Reseña' });

    // Rellenamos el formulario para que sea válido
    const starSpans = screen.getByText('Valoración *').parentElement.querySelectorAll('span[role="button"]');
    fireEvent.click(starSpans[5]); // 6/10 puntos
    fireEvent.change(screen.getByLabelText('Comentario *'), { target: { value: 'Comentario válido.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar Reseña' }));
    
    // Verificamos que no se navega a ninguna parte y el botón vuelve a estar activo
    await waitFor(() => {
      expect(mockedUseNavigate).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Enviar Reseña' })).not.toBeDisabled();
    });
  });
});