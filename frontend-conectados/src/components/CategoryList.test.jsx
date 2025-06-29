import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryList from './CategoryList'; // Asegúrate de que la ruta sea correcta

describe('CategoryList', () => {
  // 1. Renderizado de todas las categorías
  test('debe renderizar todas las categorías definidas en el array', () => {
    render(
      <BrowserRouter>
        <CategoryList />
      </BrowserRouter>
    );

    const expectedCategoryNames = [
      'Limpieza',
      'Electricidad',
      'Plomería',
      'Jardinería',
      'Peluquería',
      'Carpintería',
    ];

    expectedCategoryNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    const categoryLinks = screen.getAllByRole('link');
    expect(categoryLinks).toHaveLength(expectedCategoryNames.length);
  });

  // 2. Verificación de los enlaces (Link) y sus atributos
  test('cada enlace de categoría debe navegar a la URL de búsqueda correcta', () => {
    render(
      <BrowserRouter>
        <CategoryList />
      </BrowserRouter>
    );

    // Verificación para "Limpieza"
    const limpiezaLink = screen.getByText('Limpieza').closest('a');
    expect(limpiezaLink).toHaveAttribute('href', '/search?category=limpieza');

    // Verificación para "Jardinería"
    const jardineriaLink = screen.getByText('Jardinería').closest('a');
    expect(jardineriaLink).toHaveAttribute('href', '/search?category=jardineria');

    // Verificación para "Peluquería"
    const peluqueriaLink = screen.getByText('Peluquería').closest('a');
    expect(peluqueriaLink).toHaveAttribute('href', '/search?category=peluqueria');
  });

  // 3. Renderizado de íconos de categoría
  test('debe renderizar el ícono correcto para cada categoría', () => {
    render(
      <BrowserRouter>
        <CategoryList />
      </BrowserRouter>
    );

    // Verificación de algunos íconos específicos
    expect(screen.getByText('🧹')).toBeInTheDocument(); // Limpieza
    expect(screen.getByText('💡')).toBeInTheDocument(); // Electricidad
    expect(screen.getByText('✂️')).toBeInTheDocument(); // Peluquería
    expect(screen.getByText('🪚')).toBeInTheDocument(); // Carpintería
  });

  // 4. Verificación de clases CSS en el contenedor principal (opcional)
  test('el contenedor principal debe tener las clases CSS de grid correctas', () => {
    render(
      <BrowserRouter>
        <CategoryList />
      </BrowserRouter>
    );

    // Puedes buscar el contenedor principal por su rol o por una clase distintiva.
    // Aquí asumimos que el padre de los enlaces tiene las clases del grid.
    const mainGridContainer = screen.getAllByRole('link')[0].closest('.grid');
    expect(mainGridContainer).toHaveClass('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4');
  });

  // 5. Verificación de clases CSS en los enlaces individuales (opcional)
  test('cada enlace de categoría debe tener las clases de estilo correctas', () => {
    render(
      <BrowserRouter>
        <CategoryList />
      </BrowserRouter>
    );

    const anyCategoryLink = screen.getByText('Limpieza').closest('a'); // Tomamos uno al azar
    expect(anyCategoryLink).toHaveClass(
      'category-icon flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
    );
  });
});