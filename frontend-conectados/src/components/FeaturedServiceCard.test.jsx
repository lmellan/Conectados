import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import FeaturedServiceCard from './FeaturedServiceCard';

// Mock the StarRatingDisplay component to isolate testing
jest.mock('./StarRatingDisplay', () => {
  // eslint-disable-next-line react/display-name
  return ({ rating }) => <div data-testid="mock-star-rating-display">Rating: {rating}</div>;
});

describe('FeaturedServiceCard', () => {
  const mockService = {
    id: 'service-1',
    title: 'Clases de Guitarra',
    category: 'Música',
    description: 'Aprende a tocar la guitarra desde cero o mejora tus habilidades con clases personalizadas.',
    image: 'https://example.com/guitar-class.jpg',
    providerName: 'Carlos Santelices',
    providerImage: 'https://example.com/carlos-avatar.jpg',
    price: 25000,
    rating: 4.5, // Assuming a 1-5 scale for mockData
    reviewsCount: 15,
  };

  const mockServiceNoImage = {
    ...mockService,
    id: 'service-2',
    image: null,
    providerImage: null,
    providerName: 'María López', // Change name for avatar fallback test
    rating: 3,
    reviewsCount: 5,
  };

  const mockServiceNoRatingNoReviews = {
    ...mockService,
    id: 'service-3',
    rating: undefined,
    averageRating: undefined, // Test both rating and averageRating
    reviewsCount: undefined,
  };

  const renderFeaturedServiceCard = (serviceProps) => {
    return render(
      <Router> {/* Wrap component with Router for Link to work */}
        <FeaturedServiceCard service={serviceProps} />
      </Router>
    );
  };

  test('debe renderizar la información principal del servicio correctamente', () => {
    renderFeaturedServiceCard(mockService);

    expect(screen.getByRole('heading', { name: mockService.title, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(mockService.category)).toBeInTheDocument();
    expect(screen.getByText(mockService.providerName)).toBeInTheDocument();
    expect(screen.getByText(mockService.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockService.price}/hora`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver detalles' })).toHaveAttribute('href', `/service/${mockService.id}`);
  });

  test('debe usar la imagen del servicio si está disponible', () => {
    renderFeaturedServiceCard(mockService);
    const serviceImage = screen.getByAltText(mockService.title);
    expect(serviceImage).toBeInTheDocument();
    expect(serviceImage).toHaveAttribute('src', mockService.image);
  });

  test('debe usar un placeholder si la imagen del servicio no está disponible', () => {
    renderFeaturedServiceCard(mockServiceNoImage);
    const serviceImage = screen.getByAltText(mockServiceNoImage.title);
    expect(serviceImage).toBeInTheDocument();
    expect(serviceImage).toHaveAttribute('src', '/placeholder.svg');
  });

  test('debe usar la imagen del prestador si está disponible', () => {
    renderFeaturedServiceCard(mockService);
    const providerImage = screen.getByAltText(mockService.providerName);
    expect(providerImage).toBeInTheDocument();
    expect(providerImage).toHaveAttribute('src', mockService.providerImage);
  });

  test('debe generar un avatar si la imagen del prestador no está disponible', () => {
    renderFeaturedServiceCard(mockServiceNoImage);
    const providerImage = screen.getByAltText(mockServiceNoImage.providerName);
    expect(providerImage).toBeInTheDocument();
    // Check for the dynamically generated UI-Avatars URL
    expect(providerImage).toHaveAttribute('src', expect.stringContaining(`https://ui-avatars.com/api/?name=${encodeURIComponent(mockServiceNoImage.providerName)}`));
  });

  test('debe renderizar StarRatingDisplay con el rating correcto (multiplicado por 2)', () => {
    renderFeaturedServiceCard(mockService);
    const starRatingDisplay = screen.getByTestId('mock-star-rating-display');
    expect(starRatingDisplay).toBeInTheDocument();
    // Rating 4.5 * 2 = 9
    expect(starRatingDisplay).toHaveTextContent('Rating: 9');
  });

  test('debe renderizar StarRatingDisplay con rating 0 si no hay rating', () => {
    renderFeaturedServiceCard(mockServiceNoRatingNoReviews);
    const starRatingDisplay = screen.getByTestId('mock-star-rating-display');
    expect(starRatingDisplay).toBeInTheDocument();
    expect(starRatingDisplay).toHaveTextContent('Rating: 0'); // (0 * 2 = 0)
  });

  test('debe mostrar el conteo de reseñas si está disponible', () => {
    renderFeaturedServiceCard(mockService);
    expect(screen.getByText(`(${mockService.reviewsCount} reseñas)`)).toBeInTheDocument();
  });

  test('no debe mostrar el conteo de reseñas si no está disponible', () => {
    renderFeaturedServiceCard(mockServiceNoRatingNoReviews);
    expect(screen.queryByText(/reseñas/i)).not.toBeInTheDocument();
  });
});