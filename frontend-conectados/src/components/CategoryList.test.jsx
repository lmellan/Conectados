import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryList from './CategoryList';

describe('CategoryList', () => {
  test('renders all categories', () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    // Los nombres de las categorías deberían aparecer
    const categories = ["Limpieza", "Electricidad", "Plomería", "Jardinería", "Peluquería", "Carpintería"];
    
    categories.forEach((categoryName) => {
      expect(screen.getByText(categoryName)).toBeInTheDocument();
    });
  });

  test('renders category icons', () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    const icons = ["🧹", "💡", "🔧", "🌱", "✂️", "🪚"];

    icons.forEach((icon) => {
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  test('renders links with correct href', () => {
    render(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    );

    // Debe haber 6 links (uno por categoría)
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);

    // Verificar que cada link tenga el href correcto
    expect(links[0]).toHaveAttribute('href', '/search?category=limpieza');
    expect(links[1]).toHaveAttribute('href', '/search?category=electricidad');
    expect(links[2]).toHaveAttribute('href', '/search?category=plomeria');
    expect(links[3]).toHaveAttribute('href', '/search?category=jardineria');
    expect(links[4]).toHaveAttribute('href', '/search?category=peluqueria');
    expect(links[5]).toHaveAttribute('href', '/search?category=carpinteria');
  });
});
