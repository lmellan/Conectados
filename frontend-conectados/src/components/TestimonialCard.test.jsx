import { render, screen } from '@testing-library/react';
import TestimonialCard from './TestimonialCard';

describe('TestimonialCard', () => {
  const testimonialMock = {
    userName: 'Carla Torres',
    userImage: 'https://example.com/user.jpg',
    rating: 4,
    text: 'Muy buen servicio, puntual y profesional.',
    service: 'Electricidad',
  };

  test('renders user name, text and service', () => {
    render(<TestimonialCard testimonial={testimonialMock} />);

    expect(screen.getByText(testimonialMock.userName)).toBeInTheDocument();
    expect(screen.getByText(`"${testimonialMock.text}"`)).toBeInTheDocument();
    expect(screen.getByText(`Servicio: ${testimonialMock.service}`)).toBeInTheDocument();
  });

  test('renders user image or placeholder if not provided', () => {
    // Caso con imagen
    render(<TestimonialCard testimonial={testimonialMock} />);
    const userImage = screen.getByAltText(testimonialMock.userName);
    expect(userImage).toHaveAttribute('src', testimonialMock.userImage);

    // Caso sin imagen
    const testimonialWithoutImage = { ...testimonialMock, userImage: null };
    render(<TestimonialCard testimonial={testimonialWithoutImage} />);
    const placeholderImage = screen.getByAltText(testimonialWithoutImage.userName);
    expect(placeholderImage).toHaveAttribute('src', '/placeholder.svg');
  });

  test('renders correct number of yellow and gray stars based on rating', () => {
    render(<TestimonialCard testimonial={testimonialMock} />);

    // Obtener todas las estrellas (deberían ser 5)
    const stars = screen.getAllByRole('img', { hidden: true });

    expect(stars.length).toBe(5);

    // Las primeras `rating` estrellas deberían ser amarillas (text-yellow-400)
    for (let i = 0; i < testimonialMock.rating; i++) {
      expect(stars[i]).toHaveClass('text-yellow-400');
    }

    // Las restantes deberían ser grises (text-gray-300)
    for (let i = testimonialMock.rating; i < 5; i++) {
      expect(stars[i]).toHaveClass('text-gray-300');
    }
  });
});
