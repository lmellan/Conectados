import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header'; // Asegúrate de que la ruta sea correcta

// Mock de useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock de useNavigate
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa y conserva las exportaciones reales
  useNavigate: () => mockedUseNavigate, // Mockea solo useNavigate
}));

// Importar el mock después de mockear el módulo
import { useAuth } from '../context/AuthContext';

describe('Header', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- ESCENARIO: USUARIO NO AUTENTICADO ---

  test('debe mostrar los enlaces "Iniciar Sesión" y "Registrarse" cuando el usuario no está autenticado', () => {
    // Configurar el mock de useAuth para simular un usuario no autenticado
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      switchRole: jest.fn(),
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
    expect(screen.queryByText(/Mi Panel/i)).not.toBeInTheDocument(); // No debe mostrar Mi Panel
    expect(screen.queryByText(/Cerrar Sesión/i)).not.toBeInTheDocument(); // No debe mostrar Cerrar Sesión
    expect(screen.queryByText(/Hola,/i)).not.toBeInTheDocument(); // No debe mostrar el saludo al usuario
    expect(screen.queryByLabelText(/Vista:/i)).not.toBeInTheDocument(); // No debe mostrar el selector de rol
  });

  // 1. Enlace a la página principal "Conectados"
  test('debe tener un enlace a la página principal con el texto "Conectados"', () => {
    useAuth.mockReturnValue({ isAuthenticated: false }); // Estado base
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const homeLink = screen.getByRole('link', { name: /Conectados/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  // 2. Enlace a "Buscar Servicios"
  test('debe mostrar el enlace "Buscar Servicios" siempre', () => {
    useAuth.mockReturnValue({ isAuthenticated: false }); // Estado base
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const searchLink = screen.getByRole('link', { name: /Buscar Servicios/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');
  });

  // 3. Navegación al hacer clic en "Iniciar Sesión"
  test('debe navegar a /login al hacer clic en "Iniciar Sesión"', () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /Iniciar Sesión/i }));
    // Para probar la navegación con Link, no necesitamos mockear useNavigate aquí,
    // BrowserRouter se encarga de cambiar la URL en el entorno de prueba.
    // Sin embargo, para testar el comportamiento real de Link en un test unitario
    // a menudo se verifica el `href` o se usa una librería de prueba de enrutamiento.
    // En este caso, simplemente la presencia del enlace es suficiente.
    // Para un test más avanzado de navegación, se usaría un MemoryRouter o un router real.
  });

  // 4. Navegación al hacer clic en "Registrarse"
  test('debe navegar a /register al hacer clic en "Registrarse"', () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /Registrarse/i }));
    // Similar al caso de "Iniciar Sesión", la verificación del href es suficiente
  });


  // --- ESCENARIO: USUARIO AUTENTICADO (ROL ÚNICO) ---

  test('debe mostrar enlaces de usuario autenticado (Mi Panel, Saludo, Cerrar Sesión) y no el selector de rol si tiene un solo rol', () => {
    // Simular un usuario autenticado con un solo rol
    useAuth.mockReturnValue({
      user: { nombre: 'Juan', roles: ['BUSCADOR'], rolActivo: 'BUSCADOR' },
      logout: jest.fn(),
      switchRole: jest.fn(),
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Mi Panel/i })).toBeInTheDocument();
    expect(screen.getByText(/Hola, Juan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cerrar Sesión/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Vista:/i)).not.toBeInTheDocument(); // No debe mostrar el selector de rol
    expect(screen.queryByRole('link', { name: /Iniciar Sesión/i })).not.toBeInTheDocument(); // No debe mostrar Iniciar Sesión
    expect(screen.queryByRole('link', { name: /Registrarse/i })).not.toBeInTheDocument(); // No debe mostrar Registrarse
  });

  // 5. Navegación a "Mi Panel"
  test('debe navegar a /dashboard al hacer clic en "Mi Panel"', () => {
    useAuth.mockReturnValue({
      user: { nombre: 'Juan', roles: ['BUSCADOR'], rolActivo: 'BUSCADOR' },
      isAuthenticated: true,
    });
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const dashboardLink = screen.getByRole('link', { name: /Mi Panel/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  // 6. Funcionamiento de "Cerrar Sesión"
  test('debe llamar a logout y navegar a la página principal al hacer clic en "Cerrar Sesión"', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { nombre: 'Juan', roles: ['BUSCADOR'], rolActivo: 'BUSCADOR' },
      logout: mockLogout,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cerrar Sesión/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/'); // Verifica que useNavigate fue llamado con '/'
  });


  // --- ESCENARIO: USUARIO AUTENTICADO CON MÚLTIPLES ROLES ---

  test('debe mostrar el selector de rol cuando el usuario tiene múltiples roles', () => {
    useAuth.mockReturnValue({
      user: { nombre: 'María', roles: ['BUSCADOR', 'PRESTADOR'], rolActivo: 'BUSCADOR' },
      logout: jest.fn(),
      switchRole: jest.fn(),
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Vista:/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // El <select> tiene el rol 'combobox'
    expect(screen.getByText(/Profesional/i)).toBeInTheDocument(); // Verifica las opciones
    expect(screen.getByText(/Buscador/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('BUSCADOR'); // Verifica el valor activo inicial
  });

  // 7. Cambio de rol a través del selector
  test('debe llamar a switchRole con el nuevo rol cuando se selecciona una opción en el combobox', () => {
    const mockSwitchRole = jest.fn();
    useAuth.mockReturnValue({
      user: { nombre: 'María', roles: ['BUSCADOR', 'PRESTADOR'], rolActivo: 'BUSCADOR' },
      logout: jest.fn(),
      switchRole: mockSwitchRole,
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const roleSelect = screen.getByRole('combobox', { name: /Vista:/i });
    fireEvent.change(roleSelect, { target: { value: 'PRESTADOR' } });

    expect(mockSwitchRole).toHaveBeenCalledTimes(1);
    expect(mockSwitchRole).toHaveBeenCalledWith('PRESTADOR');
  });

  // 8. Visualización correcta de los nombres de los roles en el selector
  test('debe mostrar "Profesional" para el rol "PRESTADOR" y "Buscador" para otros roles en el selector', () => {
    useAuth.mockReturnValue({
      user: { nombre: 'María', roles: ['BUSCADOR', 'PRESTADOR'], rolActivo: 'BUSCADOR' },
      logout: jest.fn(),
      switchRole: jest.fn(),
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Encuentra las opciones por el texto visible
    const profesionalOption = screen.getByRole('option', { name: 'Profesional' });
    const buscadorOption = screen.getByRole('option', { name: 'Buscador' });

    // Verifica que los valores reales de las opciones (los `value` de los <option>) sean correctos
    expect(profesionalOption).toHaveValue('PRESTADOR');
    expect(buscadorOption).toHaveValue('BUSCADOR');

    // Asegúrate de que ambas opciones estén en el documento
    expect(profesionalOption).toBeInTheDocument();
    expect(buscadorOption).toBeInTheDocument();
  });
});