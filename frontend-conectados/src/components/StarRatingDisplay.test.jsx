import { render, screen } from '@testing-library/react';
import StarRatingDisplay from './StarRatingDisplay';
import '@testing-library/jest-dom'; // Para los matchers extendidos como toBeInTheDocument

describe('StarRatingDisplay', () => {
  // Función auxiliar para renderizar el componente
  const renderStarRatingDisplay = (rating) => {
    return render(<StarRatingDisplay rating={rating} />);
  };

  test('debe mostrar 5 estrellas completas para un rating de 10', () => {
    renderStarRatingDisplay(10);
    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars).toHaveLength(5);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('empty-star')).toHaveLength(0);
  });

  test('debe mostrar 0 estrellas completas y 5 vacías para un rating de 0', () => {
    renderStarRatingDisplay(0);
    const fullStars = screen.queryAllByTestId('full-star');
    expect(fullStars).toHaveLength(0);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(5);
  });

  test('debe mostrar 3 estrellas completas, 1 media y 1 vacía para un rating de 7 (3.5 en escala de 5)', () => {
    renderStarRatingDisplay(7); // 7/2 = 3.5 -> 3 full, 1 half, 1 empty

    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars).toHaveLength(3);

    const halfStar = screen.getByTestId('half-star');
    expect(halfStar).toBeInTheDocument();

    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(1);
  });

  test('debe mostrar 2 estrellas completas, 1 media y 2 vacías para un rating de 5 (2.5 en escala de 5)', () => {
    renderStarRatingDisplay(5); // 5/2 = 2.5 -> 2 full, 1 half, 2 empty

    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars).toHaveLength(2);

    const halfStar = screen.getByTestId('half-star');
    expect(halfStar).toBeInTheDocument();

    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(2);
  });

  test('debe mostrar 0 estrellas completas, 1 media y 4 vacías para un rating de 1 (0.5 en escala de 5)', () => {
    renderStarRatingDisplay(1); // 1/2 = 0.5 -> 0 full, 1 half, 4 empty

    const fullStars = screen.queryAllByTestId('full-star');
    expect(fullStars).toHaveLength(0);

    const halfStar = screen.getByTestId('half-star');
    expect(halfStar).toBeInTheDocument();

    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(4);
  });

  test('debe mostrar 1 estrella completa, 0 medias y 4 vacías para un rating de 2 (1 en escala de 5)', () => {
    renderStarRatingDisplay(2); // 2/2 = 1 -> 1 full, 0 half, 4 empty

    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars).toHaveLength(1);

    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();

    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(4);
  });

  test('debe mostrar 4 estrellas completas, 0 medias y 1 vacía para un rating de 8 (4 en escala de 5)', () => {
    renderStarRatingDisplay(8); // 8/2 = 4 -> 4 full, 0 half, 1 empty

    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars).toHaveLength(4);

    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();

    const emptyStars = screen.getAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(1);
  });
});