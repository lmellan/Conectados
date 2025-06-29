import { render, screen } from '@testing-library/react';
import TestimonialCard from './TestimonialCard'; // Adjust the path as needed

describe('TestimonialCard', () => {
  const mockTestimonial = {
    userName: 'Ana Torres',
    userImage: 'https://example.com/ana-avatar.jpg',
    rating: 4,
    text: '¡Excelente servicio! Quedé muy contenta con el trabajo realizado por el profesional.',
    service: 'Instalación de Lámparas',
  };

  const mockTestimonialNoImage = {
    ...mockTestimonial,
    userName: 'Pedro Gómez',
    userImage: null, // Simulate no user image
    rating: 3,
  };

  const mockTestimonialFullRating = {
    ...mockTestimonial,
    userName: 'Luisa Fernández',
    rating: 5,
  };

  const mockTestimonialZeroRating = {
    ...mockTestimonial,
    userName: 'Carlos Ruiz',
    rating: 0,
  };

  const renderTestimonialCard = (testimonialProps) => {
    return render(<TestimonialCard testimonial={testimonialProps} />);
  };

  test('should render the user name, testimonial text, and service name', () => {
    renderTestimonialCard(mockTestimonial);
    expect(screen.getByRole('heading', { name: mockTestimonial.userName, level: 4 })).toBeInTheDocument();
    expect(screen.getByText(`"${mockTestimonial.text}"`)).toBeInTheDocument();
    expect(screen.getByText(`Servicio: ${mockTestimonial.service}`)).toBeInTheDocument();
  });

  test('should display the user image from the testimonial object', () => {
    renderTestimonialCard(mockTestimonial);
    const userImage = screen.getByAltText(mockTestimonial.userName);
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute('src', mockTestimonial.userImage);
  });

  test('should use a placeholder image when userImage is null or undefined', () => {
    renderTestimonialCard(mockTestimonialNoImage);
    const userImage = screen.getByAltText(mockTestimonialNoImage.userName);
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute('src', '/placeholder.svg');
  });

  // Los siguientes tests fallan porque el data-testid no está en el HTML renderizado.
  // Una vez que el Paso 1 se aplique y verifique, estos deberían pasar.
  test('should display the correct number of filled stars based on the rating', () => {
    renderTestimonialCard(mockTestimonial); // rating: 4

    const filledStars = screen.getAllByTestId('star-icon-filled');
    const emptyStars = screen.getAllByTestId('star-icon-empty');

    expect(filledStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });

  test('should display all 5 stars as filled for a 5-star rating', () => {
    renderTestimonialCard(mockTestimonialFullRating); // rating: 5

    const filledStars = screen.getAllByTestId('star-icon-filled');
    const emptyStars = screen.queryAllByTestId('star-icon-empty');

    expect(filledStars).toHaveLength(5);
    expect(emptyStars).toHaveLength(0);
  });

  test('should display all 5 stars as empty for a 0-star rating', () => {
    renderTestimonialCard(mockTestimonialZeroRating); // rating: 0

    const filledStars = screen.queryAllByTestId('star-icon-filled');
    const emptyStars = screen.getAllByTestId('star-icon-empty');

    expect(filledStars).toHaveLength(0);
    expect(emptyStars).toHaveLength(5);
  });
});