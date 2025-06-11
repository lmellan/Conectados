import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireRole from './RequireRole'; // Asegúrate de que la ruta sea correcta

// --- GLOBAL MOCK PARA react-router-dom ---
jest.mock('react-router-dom', () => {
  const actualReactRouterDom = jest.requireActual('react-router-dom');
  const MockedNavigateComponent = jest.fn(() => null); // Creamos la instancia del mock aquí
  return {
    ...actualReactRouterDom,
    Navigate: MockedNavigateComponent, // Exportamos nuestro mock como 'Navigate'
  };
});

// --- GLOBAL MOCK PARA useAuth hook ---
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Importamos el mock de Navigate y useAuth desde sus módulos mockeados
import { Navigate as MockedNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


describe('RequireRole', () => {
  // Componentes de prueba simples (ya no necesitamos que rendericen contenido para estas aserciones específicas)
  const AuthorizedContent = () => <div>Contenido Autorizado</div>;
  const DashboardBuscador = () => <div>Panel Buscador</div>;
  const DashboardPrestador = () => <div>Panel Profesional</div>;
  const LoginPage = () => <div>Página de Login</div>; // Mantener por si se quiere visualmente, pero no se buscará su texto.

  beforeEach(() => {
    jest.clearAllMocks();
    MockedNavigate.mockImplementation(() => null);
  });

  // 1. Renders children when the active role matches the required role
  test('debe renderizar los componentes hijos cuando el rol activo coincide con el rol requerido', () => {
    useAuth.mockReturnValue({
      rolActivo: 'BUSCADOR',
    });

    render(
      <MemoryRouter initialEntries={['/some-protected-route']}>
        <Routes>
          <Route path="/some-protected-route" element={<RequireRole role="BUSCADOR"><AuthorizedContent /></RequireRole>} />
          {/* Estas rutas no serán activadas por el Navigate mock, pero son necesarias para el MemoryRouter */}
          <Route path="/dashboard/buscador" element={<DashboardBuscador />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido Autorizado')).toBeInTheDocument();
    expect(MockedNavigate).not.toHaveBeenCalled(); // Verificamos que Navigate NO fue llamado
  });

  // 2. Redirige a /login si rolActivo es null (ej. usuario no autenticado)
  test('debe redirigir a /login si rolActivo es null', () => {
    useAuth.mockReturnValue({
      rolActivo: null,
    });

    render(
      <MemoryRouter initialEntries={['/some-protected-route']}>
        <Routes>
          <Route path="/some-protected-route" element={<RequireRole role="BUSCADOR"><AuthorizedContent /></RequireRole>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/prestador" element={<DashboardPrestador />} />
        </Routes>
      </MemoryRouter>
    );

    // Aseguramos que el contenido protegido NO se muestre
    expect(screen.queryByText('Contenido Autorizado')).not.toBeInTheDocument();

    // Verificamos que nuestro componente Navigate mockeado fue llamado correctamente
    expect(MockedNavigate).toHaveBeenCalledTimes(1);
    expect(MockedNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/login', replace: true }),
      {}
    );
    // REMOVIDO: expect(screen.getByText('Página de Login')).toBeInTheDocument(); // Esto fallaba
  });

  // 3. Redirige a /dashboard/rolActivo (lowercase) cuando los roles no coinciden
  test('debe redirigir a /dashboard/rolactivo cuando el rol activo no coincide con el rol requerido', () => {
    useAuth.mockReturnValue({
      rolActivo: 'PRESTADOR',
    });

    render(
      <MemoryRouter initialEntries={['/some-protected-route']}>
        <Routes>
          <Route path="/some-protected-route" element={<RequireRole role="BUSCADOR"><AuthorizedContent /></RequireRole>} />
          <Route path="/dashboard/prestador" element={<DashboardPrestador />} />
          <Route path="/dashboard/buscador" element={<DashboardBuscador />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Aseguramos que el contenido protegido NO se muestre
    expect(screen.queryByText('Contenido Autorizado')).not.toBeInTheDocument();

    // Verificamos que nuestro componente Navigate mockeado fue llamado correctamente
    expect(MockedNavigate).toHaveBeenCalledTimes(1);
    expect(MockedNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/dashboard/prestador', replace: true }),
      {}
    );
    // REMOVIDO: expect(screen.getByText('Panel Profesional')).toBeInTheDocument(); // Esto fallaba
  });

  // 4. Ensures `replace: true` is always used for redirection for a generic mismatch
  test('la redirección debe usar la propiedad "replace" cuando rolActivo es diferente', () => {
    useAuth.mockReturnValue({
      rolActivo: 'OTROROL',
    });

    render(
      <MemoryRouter initialEntries={['/some-protected-route']}>
        <Routes>
          <Route path="/some-protected-route" element={<RequireRole role="BUSCADOR"><AuthorizedContent /></RequireRole>} />
          <Route path="/dashboard/otrorol" element={<div>Panel Otro Rol</div>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(MockedNavigate).toHaveBeenCalledTimes(1);
    expect(MockedNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/dashboard/otrorol', replace: true }),
      {}
    );
  });
});