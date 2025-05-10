import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServiceCard from './ServiceCard';

describe('ServiceCard', () => {
  const serviceMock = {
    id: 123,
    title: 'Limpieza de Casa',
    category: 'Limpieza',
    image: 'https://example.com/image.jpg',
    providerName: 'Juan Pérez',
    providerImage: 'https://example.com/provider.jpg',
    description: 'Servicio de limpieza general para hogares y oficinas.',
    price: 15000,
  };

  test('renders service details', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    // Verifica título
    expect(screen.getByText(serviceMock.title)).toBeInTheDocument();
    // Verifica categoría
    expect(screen.getByText(serviceMock.category)).toBeInTheDocument();
    // Verifica proveedor
    expect(screen.getByText(serviceMock.providerName)).toBeInTheDocument();
    // Verifica descripción
    expect(screen.getByText(serviceMock.description)).toBeInTheDocument();
    // Verifica precio
    expect(screen.getByText(`$${serviceMock.price}/hora`)).toBeInTheDocument();
  });

  test('renders service and provider images', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    // Imagen principal
    const serviceImage = screen.getByAltText(serviceMock.title);
    expect(serviceImage).toHaveAttribute('src', serviceMock.image);

    // Imagen proveedor
    const providerImage = screen.getByAltText(serviceMock.providerName);
    expect(providerImage).toHaveAttribute('src', serviceMock.providerImage);
  });

  test('renders placeholder images if no image provided', () => {
    const serviceWithoutImages = { ...serviceMock, image: null, providerImage: null };

    render(
      <MemoryRouter>
        <ServiceCard service={serviceWithoutImages} />
      </MemoryRouter>
    );

    const serviceImage = screen.getByAltText(serviceMock.title);
    expect(serviceImage).toHaveAttribute('src', '/placeholder.svg');

    const providerImage = screen.getByAltText(serviceMock.providerName);
    expect(providerImage).toHaveAttribute('src', '/placeholder.svg');
  });

  test('renders "Ver detalles" link with correct href', () => {
    render(
      <MemoryRouter>
        <ServiceCard service={serviceMock} />
      </MemoryRouter>
    );

    const detailsLink = screen.getByRole('link', { name: /ver detalles/i });
    expect(detailsLink).toHaveAttribute('href', `/service/${serviceMock.id}`);
  });
});
