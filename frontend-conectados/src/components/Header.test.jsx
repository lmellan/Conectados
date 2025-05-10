import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Helper para renderizar con contexto y router
function renderWithProviders(ui, { user = null } = {}) {
  const logout = jest.fn();

  return {
    logout,
    ...render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user, logout }}>
          {ui}
        </AuthContext.Provider>
      </MemoryRouter>
    ),
  };
}

describe('Header', () => {
  test('renders site name and public links when not logged in', () => {
    renderWithProviders(<Header />, { user: null });

    expect(screen.getByText('Conectados')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.getByText('Ofrecer Servicios')).toBeInTheDocument();
  });

  test('renders user links when logged in as normal user', () => {
    renderWithProviders(<Header />, { user: { isProfessional: false } });

    expect(screen.getByText('Mi Panel')).toHaveAttribute('href', '/user-dashboard');
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('renders user links when logged in as professional', () => {
    renderWithProviders(<Header />, { user: { isProfessional: true } });

    expect(screen.getByText('Mi Panel')).toHaveAttribute('href', '/pro-dashboard');
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('can toggle mobile menu', async () => {
    renderWithProviders(<Header />, { user: null });

    const toggleButton = screen.getByRole('button');
    await userEvent.click(toggleButton);

    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  test('calls logout when logout button is clicked', async () => {
    const { logout } = renderWithProviders(<Header />, { user: { isProfessional: false } });

    const logoutButton = screen.getByText('Cerrar Sesión');
    await userEvent.click(logoutButton);

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
