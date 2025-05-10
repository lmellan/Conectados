import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  test('renders section titles and descriptions', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Secciones principales
    expect(screen.getByText('Conectados')).toBeInTheDocument();
    expect(screen.getByText('Enlaces')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();

    // Descripción
    expect(screen.getByText(/Conectando usuarios/i)).toBeInTheDocument();

    // Contacto
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono:/i)).toBeInTheDocument();
  });

  test('renders navigation links with correct href', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);

    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/search');
    expect(links[2]).toHaveAttribute('href', '/register-pro');
  });

  test('renders current year in copyright', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });
});
