import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Cambiado a MemoryRouter
import ProtectedRoute from './ProtectedRoute';

// Mock de useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../context/AuthContext'; // Importar el mock

describe('ProtectedRoute', () => {
  const ProtectedContent = () => <div>Contenido Protegido</div>;
  const LoginPage = () => <div>Página de Login</div>; // Componente para la página de login

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Redirección cuando el usuario NO está autenticado
  test('debe redirigir al usuario a /login si no está autenticado', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/']} > {/* Inicia en '/' */}
        <Routes>
          <Route path="/" element={<ProtectedRoute><ProtectedContent /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} /> {/* La ruta de login */}
        </Routes>
      </MemoryRouter>
    );

    // Después de la renderización, deberíamos estar en la página de login
    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
  });

  // 2. Renderizado del contenido hijo cuando el usuario SÍ está autenticado (MODIFICADO)
  test('debe renderizar los componentes hijos si el usuario está autenticado', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/']} > {/* Inicia en '/' */}
        <Routes>
          <Route path="/" element={<ProtectedRoute><ProtectedContent /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Esperamos que el contenido protegido esté en el documento, y la página de login no.
    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
  });

  // ... (El test 3 lo veremos después)
});