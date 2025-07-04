import { render, screen } from '@testing-library/react';
import TestimonialCard from './TestimonialCard';
import '@testing-library/jest-dom';

// Mock del componente StarRatingDisplay
// Esto es crucial porque TestimonialCard ahora delega el renderizado de estrellas a StarRatingDisplay.
// Para probar TestimonialCard de forma aislada, simulamos su comportamiento.
jest.mock('./StarRatingDisplay', () => {
  // eslint-disable-next-line react/display-name
  return ({ rating }) => {
    // Para que las pruebas pasen, simulamos el renderizado de estrellas
    // que el componente original haría, usando data-testid.
    const maxRating = 5;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        stars.push(<span key={i} data-testid="star-icon-filled">★</span>);
      } else {
        stars.push(<span key={i} data-testid="star-icon-empty">☆</span>);
      }
    }
    return <div data-testid="star-rating-display">{stars}</div>;
  };
});

describe('Tarjeta de Testimonio (TestimonialCard)', () => {
  const mockTestimonio = {
    userName: 'Ana Torres',
    userImage: 'https://example.com/ana-avatar.jpg',
    rating: 4,
    text: '¡Excelente servicio! Quedé muy contenta con el trabajo realizado por el profesional.',
    service: 'Instalación de Lámparas',
  };

  const mockTestimonioSinImagen = {
    ...mockTestimonio,
    userName: 'Pedro Gómez',
    userImage: null, // Simula que no hay imagen de usuario
    rating: 3,
  };

  const mockTestimonioCalificacionCompleta = {
    ...mockTestimonio,
    userName: 'Luisa Fernández',
    rating: 5,
  };

  const mockTestimonioCalificacionCero = {
    ...mockTestimonio,
    userName: 'Carlos Ruiz',
    rating: 0,
  };

  const renderizarTarjeta = (propsTestimonio) => {
    return render(<TestimonialCard testimonial={propsTestimonio} />);
  };

  test('debería renderizar el nombre de usuario, el texto del testimonio y el nombre del servicio', () => {
    renderizarTarjeta(mockTestimonio);
    expect(screen.getByRole('heading', { name: mockTestimonio.userName, level: 4 })).toBeInTheDocument();
    expect(screen.getByText(`"${mockTestimonio.text}"`)).toBeInTheDocument();
    expect(screen.getByText(`Servicio: ${mockTestimonio.service}`)).toBeInTheDocument();
  });

  test('debería mostrar la imagen del usuario obtenida del objeto de testimonio', () => {
    renderizarTarjeta(mockTestimonio);
    const imagenUsuario = screen.getByAltText(mockTestimonio.userName);
    expect(imagenUsuario).toBeInTheDocument();
    expect(imagenUsuario).toHaveAttribute('src', mockTestimonio.userImage);
  });

  test('debería usar una imagen de reemplazo (placeholder) si userImage es nulo o indefinido', () => {
    renderizarTarjeta(mockTestimonioSinImagen);
    const imagenUsuario = screen.getByAltText(mockTestimonioSinImagen.userName);
    expect(imagenUsuario).toBeInTheDocument();
    expect(imagenUsuario).toHaveAttribute('src', '/placeholder.svg');
  });

  // Pruebas para StarRatingDisplay ahora que está simulado.
  // Verifican que TestimonialCard pasa la prop 'rating' correctamente
  // al componente simulado.
  test('debería mostrar el número correcto de estrellas rellenas según la calificación', () => {
    renderizarTarjeta(mockTestimonio); // rating: 4

    const estrellasRellenas = screen.getAllByTestId('star-icon-filled');
    const estrellasVacias = screen.getAllByTestId('star-icon-empty');

    expect(estrellasRellenas).toHaveLength(4);
    expect(estrellasVacias).toHaveLength(1);
  });

  test('debería mostrar las 5 estrellas rellenas para una calificación de 5 estrellas', () => {
    renderizarTarjeta(mockTestimonioCalificacionCompleta); // rating: 5

    const estrellasRellenas = screen.getAllByTestId('star-icon-filled');
    // Usamos queryAll para que no falle si no encuentra ninguna (comportamiento esperado)
    const estrellasVacias = screen.queryAllByTestId('star-icon-empty'); 

    expect(estrellasRellenas).toHaveLength(5);
    expect(estrellasVacias).toHaveLength(0);
  });

  test('debería mostrar las 5 estrellas vacías para una calificación de 0 estrellas', () => {
    renderizarTarjeta(mockTestimonioCalificacionCero); // rating: 0

    // Usamos queryAll para que no falle si no encuentra ninguna
    const estrellasRellenas = screen.queryAllByTestId('star-icon-filled'); 
    const estrellasVacias = screen.getAllByTestId('star-icon-empty');

    expect(estrellasRellenas).toHaveLength(0);
    expect(estrellasVacias).toHaveLength(5);
  });
});