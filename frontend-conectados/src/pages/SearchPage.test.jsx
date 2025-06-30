import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from './SearchPage';
import '@testing-library/jest-dom';

// --- Mocks (Simulaciones de Dependencias) ---

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

global.fetch = jest.fn();

jest.mock('../components/SearchBar', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ onSearch, initialValue }) => (
    <input
      data-testid="mock-search-bar"
      aria-label="Barra de búsqueda"
      onChange={(e) => onSearch(e.target.value)}
      defaultValue={initialValue || ""}
    />
  );
});

jest.mock('../components/ServiceCard', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ service }) => (
    <div data-testid="mock-service-card">
      <p>{service.nombre}</p>
      <p>Precio: {service.precio}</p>
      <p>Rating: {service.valoracionPromedio || 0}</p>
    </div>
  );
});

// --- Datos de Prueba ---
const mockServicesData = [
  { id: 1, nombre: 'Servicio de Plomería Urgente', descripcion: 'Reparaciones rápidas', categoria: 'Plomería', precio: 5000, valoracionPromedio: 4.8 },
  { id: 2, nombre: 'Instalación Eléctrica Completa', descripcion: 'Para casas nuevas', categoria: 'Electricidad', precio: 8000, valoracionPromedio: 4.9 },
  { id: 3, nombre: 'Jardinería y Paisajismo', descripcion: 'Mantenimiento de jardines', categoria: 'Jardinería', precio: 3000, valoracionPromedio: 4.5 },
  { id: 4, nombre: 'Reparación de Techos', descripcion: 'Arreglos y goteras', categoria: 'Plomería', precio: 7000, valoracionPromedio: 4.0 },
];

const renderSearchPage = (search = '') => {
  mockUseLocation.mockReturnValue({ search });
  return render(
    <BrowserRouter>
      <SearchPage />
    </BrowserRouter>
  );
};

// --- Suite de Tests para la Página de Búsqueda ---
describe('Página de Búsqueda (SearchPage)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockServicesData,
    });
  });

  test('debería obtener y mostrar todos los servicios, ordenados por valoración por defecto', async () => {
    renderSearchPage();
    const serviceCards = await screen.findAllByTestId('mock-service-card');
    expect(serviceCards).toHaveLength(4);
    expect(serviceCards[0]).toHaveTextContent('Instalación Eléctrica Completa');
    expect(serviceCards[1]).toHaveTextContent('Servicio de Plomería Urgente');
  });

  // === TEST CORREGIDO #1 ===
  test('debería filtrar los servicios según el término de búsqueda', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');

    const searchInput = screen.getByLabelText('Barra de búsqueda');
    // CORRECCIÓN: Usamos "repara" para que coincida con "Reparación" y "Reparaciones"
    fireEvent.change(searchInput, { target: { value: 'repara' } });

    await waitFor(() => {
      const serviceCards = screen.getAllByTestId('mock-service-card');
      // Ahora la expectativa de 2 resultados es correcta
      expect(serviceCards).toHaveLength(2);
      expect(screen.getByText('Servicio de Plomería Urgente')).toBeInTheDocument();
      expect(screen.getByText('Reparación de Techos')).toBeInTheDocument();
      expect(screen.queryByText('Jardinería y Paisajismo')).not.toBeInTheDocument();
    });
  });

  test('debería filtrar los servicios al seleccionar una categoría', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');
    const categorySelect = screen.getByLabelText('Categoría');
    fireEvent.change(categorySelect, { target: { value: 'Plomería' } });

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-service-card')).toHaveLength(2);
      expect(screen.getByText('Servicio de Plomería Urgente')).toBeInTheDocument();
    });
  });

  test('debería reordenar los servicios por precio ascendente', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');

    // Aquí podemos ser más específicos al seleccionar el combobox de ordenación
    const sortSelect = screen.getByDisplayValue('Ordenar por: Mejor valorados');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    
    await waitFor(() => {
      const serviceCards = screen.getAllByTestId('mock-service-card');
      expect(serviceCards[0]).toHaveTextContent('Jardinería y Paisajismo');
      expect(serviceCards[3]).toHaveTextContent('Instalación Eléctrica Completa');
    });
  });

  // === TEST CORREGIDO #2 ===
  test('debería reordenar los servicios por precio descendente', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');

    // CORRECCIÓN: Usamos getByDisplayValue para seleccionar el combobox correcto sin ambigüedad.
    const sortSelect = screen.getByDisplayValue('Ordenar por: Mejor valorados');
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    await waitFor(() => {
      const serviceCards = screen.getAllByTestId('mock-service-card');
      expect(serviceCards[0]).toHaveTextContent('Instalación Eléctrica Completa');
      expect(serviceCards[1]).toHaveTextContent('Reparación de Techos');
    });
  });

  // === TEST CORREGIDO #3 ===
  test('debería resetear todos los filtros al hacer clic en "Limpiar filtros"', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');

    // 1. Aplicamos un filtro de categoría (más predecible)
    const categorySelect = screen.getByLabelText('Categoría');
    fireEvent.change(categorySelect, { target: { value: 'Plomería' } });
    
    await waitFor(() => {
      // CORRECCIÓN: Verificamos que el filtro se aplicó correctamente (2 resultados para Plomería)
      expect(screen.getAllByTestId('mock-service-card')).toHaveLength(2);
    });

    // 2. Hacemos clic en el botón de limpiar
    const clearButton = screen.getByRole('button', { name: 'Limpiar filtros' });
    fireEvent.click(clearButton);

    // 3. Verificamos que se muestran todos los servicios de nuevo
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-service-card')).toHaveLength(4);
    });
    
    expect(screen.getByLabelText('Barra de búsqueda')).toHaveValue('');
    expect(screen.getByLabelText('Categoría')).toHaveValue('Todas las categorías');
  });

  test('debería mostrar un mensaje si ningún servicio coincide con los filtros', async () => {
    renderSearchPage();
    await screen.findAllByTestId('mock-service-card');
    
    const searchInput = screen.getByLabelText('Barra de búsqueda');
    fireEvent.change(searchInput, { target: { value: 'termino_inexistente_123' } });

    expect(await screen.findByText(/No se encontraron servicios que coincidan/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-service-card')).not.toBeInTheDocument();
  });
});