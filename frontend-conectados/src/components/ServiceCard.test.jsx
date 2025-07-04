import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceCard from './ServiceCard'; // Adjust the path as needed

describe('ServiceCard', () => {
  // Define a mock service object for consistent testing
  const mockService = {
    id: 1,
    nombre: 'Limpieza a Domicilio',
    categoria: 'Limpieza',
    descripcion: 'Servicio de limpieza profunda para hogares y oficinas. Incluye baños, cocinas y habitaciones.',
    precio: 25,
    foto: 'https://example.com/cleaning-service.jpg',
    prestador: {
      nombre: 'María Pérez',
      imagen: 'https://example.com/maria-avatar.jpg',
    },
  };

  const mockServiceNoPhoto = {
    ...mockService,
    id: 2,
    foto: null, // Simulate no service photo
  };

  const mockServiceNoProviderImage = {
    ...mockService,
    id: 3,
    prestador: {
      nombre: 'Juan García',
      imagen: null, // Simulate no provider image
    },
  };

  // Helper to render the component within a BrowserRouter
  const renderServiceCard = (serviceProps) => {
    return render(
      <BrowserRouter>
        <ServiceCard service={serviceProps} />
      </BrowserRouter>
    );
  };

  // 1. Renders service details correctly
  test('should render service name, description, category, and price', () => {
    renderServiceCard(mockService);

    expect(screen.getByRole('heading', { name: mockService.nombre, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(mockService.categoria)).toBeInTheDocument();
    expect(screen.getByText(mockService.descripcion)).toBeInTheDocument();
    expect(screen.getByText(`$${mockService.precio}/hora`)).toBeInTheDocument();
  });

  // 2. Renders provider details correctly
  test('should render the provider name and avatar', () => {
    renderServiceCard(mockService);

    expect(screen.getByText(mockService.prestador.nombre)).toBeInTheDocument();
    const providerAvatar = screen.getByAltText(mockService.prestador.nombre);
    expect(providerAvatar).toBeInTheDocument();
    expect(providerAvatar).toHaveAttribute('src', mockService.prestador.imagen);
  });

  // 3. Displays the correct service image
  test('should display the service image from the service object', () => {
    renderServiceCard(mockService);

    const serviceImage = screen.getByAltText(mockService.nombre);
    expect(serviceImage).toBeInTheDocument();
    expect(serviceImage).toHaveAttribute('src', mockService.foto);
  });

  // 4. Uses placeholder image when service.foto is not provided
  test('should use a placeholder image when service.foto is null or undefined', () => {
    renderServiceCard(mockServiceNoPhoto);

    const serviceImage = screen.getByAltText(mockServiceNoPhoto.nombre);
    expect(serviceImage).toBeInTheDocument();
    expect(serviceImage).toHaveAttribute('src', '/placeholder.svg');
  });

  // 5. Uses UI Avatars for provider image when provider.imagen is not provided
  test('should use UI Avatars for provider image when service.prestador.imagen is null or undefined', () => {
    renderServiceCard(mockServiceNoProviderImage);

    const providerAvatar = screen.getByAltText(mockServiceNoProviderImage.prestador.nombre);
    const expectedAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(mockServiceNoProviderImage.prestador.nombre)}&background=0D8ABC&color=fff`;

    expect(providerAvatar).toBeInTheDocument();
    expect(providerAvatar).toHaveAttribute('src', expectedAvatarUrl);
  });

  // 6. Renders the "Ver detalles" link with the correct URL
  test('should render "Ver detalles" link pointing to the correct service ID', () => {
    renderServiceCard(mockService);

    const detailsLink = screen.getByRole('link', { name: /ver detalles/i });
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', `/service/${mockService.id}`);
  });

  // 7. Applies `line-clamp-2` class to description
  test('should apply the line-clamp-2 class to the description paragraph', () => {
    renderServiceCard(mockService);

    const descriptionElement = screen.getByText(mockService.descripcion);
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });
});