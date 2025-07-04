import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import '@testing-library/jest-dom';

// --- Mocks de Componentes Hijos ---
// Simulamos cada componente hijo para aislar las pruebas de HomePage.
// Esto asegura que probamos SÓLO la lógica de HomePage y sus datos.

jest.mock('../components/SearchBar', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="mock-search-bar">Barra de Búsqueda</div>;
});

jest.mock('../components/CategoryList', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="mock-category-list">Lista de Categorías</div>;
});

// El mock de FeaturedServiceCard recibe 'service' y muestra su nombre para poder verificarlo.
jest.mock('../components/FeaturedServiceCard', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ service }) => <div data-testid="mock-featured-service">{service.name}</div>;
});

// El mock de TestimonialCard recibe 'testimonial' y muestra el nombre del usuario.
jest.mock('../components/TestimonialCard', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ testimonial }) => <div data-testid="mock-testimonial-card">{testimonial.userName}</div>;
});


// --- Estrategia de Mock de Datos Flexible ---
// Definimos los datos por defecto en variables 'let' para poder modificarlas en cada test.
let mockServicesData;
let mockTestimonialsData;

// Usamos 'get' en el mock. Esto asegura que cada vez que el código acceda a 
// `services` o `testimonials`, leerá el valor ACTUAL de nuestras variables.
jest.mock('../data/mockData', () => ({
  get services() { return mockServicesData; },
  get testimonials() { return mockTestimonialsData; },
}));


describe('Página Principal (HomePage)', () => {

  // Función auxiliar para renderizar el componente dentro del BrowserRouter
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  // Este bloque es crucial. Antes de CADA test, reseteamos los datos a su estado original.
  // Así, un test que modifica los datos no afecta a los tests siguientes.
  beforeEach(() => {
    mockServicesData = [
      { id: 1, name: 'Servicio Básico', rating: 3, professional: { name: 'Carlos' } },
      { id: 2, name: 'Servicio Premium', rating: 5, professional: { name: 'Ana' } },
      { id: 3, name: 'Servicio Estándar', rating: 4, professional: { name: 'Pedro' } },
      { id: 4, name: 'Servicio Económico', rating: 2, professional: { name: 'Luisa' } },
    ];
    mockTestimonialsData = [
      { id: 1, userName: 'Juan Pérez', text: 'Excelente.' },
      { id: 2, userName: 'María Gómez', text: 'Muy bueno.' },
    ];
  });

  describe('Sección Hero', () => {
    test('debería renderizar el título principal, la descripción y los botones de acción', () => {
      renderHomePage();
      
      expect(screen.getByRole('heading', { name: /Conectados – Servicios a un Clic/i })).toBeInTheDocument();
      expect(screen.getByText(/Conectamos a usuarios con los mejores profesionales/i)).toBeInTheDocument();
      expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links.find(link => link.textContent === 'Buscar Servicios')).toHaveAttribute('href', '/register');
      expect(links.find(link => link.textContent === 'Ofrecer mis Servicios')).toHaveAttribute('href', '/register');
    });
  });

  describe('Sección de Servicios Destacados', () => {
    test('debería mostrar solo los 3 servicios con la calificación más alta', () => {
      renderHomePage();

      expect(screen.getByRole('heading', { name: 'Servicios Destacados' })).toBeInTheDocument();

      const featuredServices = screen.getAllByTestId('mock-featured-service');
      expect(featuredServices).toHaveLength(3);

      // Verificamos que los servicios renderizados son los de mayor rating (5, 4, 3)
      expect(screen.getByText('Servicio Premium')).toBeInTheDocument();
      expect(screen.getByText('Servicio Estándar')).toBeInTheDocument();
      expect(screen.getByText('Servicio Básico')).toBeInTheDocument();
      
      // Verificamos que el servicio de menor rating NO se renderiza
      expect(screen.queryByText('Servicio Económico')).not.toBeInTheDocument();
    });

    test('debería mostrar un mensaje si no hay servicios disponibles', () => {
      // Modificamos la variable de datos solo para este test
      mockServicesData = [];
      
      renderHomePage();

      expect(screen.getByText('No hay servicios destacados disponibles en este momento.')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-featured-service')).not.toBeInTheDocument();
    });
  });

  describe('Sección de Testimonios', () => {
    test('debería renderizar una tarjeta por cada testimonio en los datos', () => {
      renderHomePage();

      expect(screen.getByRole('heading', { name: 'Lo que dicen nuestros usuarios' })).toBeInTheDocument();
      
      const testimonialCards = screen.getAllByTestId('mock-testimonial-card');
      expect(testimonialCards).toHaveLength(mockTestimonialsData.length);

      // Verificamos que los datos correctos se pasaron a las tarjetas simuladas
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María Gómez')).toBeInTheDocument();
    });

    test('debería mostrar un mensaje si no hay testimonios disponibles', () => {
      // Modificamos la variable de datos solo para este test
      mockTestimonialsData = [];

      renderHomePage();

      expect(screen.getByText('Aún no hay testimonios disponibles.')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-testimonial-card')).not.toBeInTheDocument();
    });

  });

  describe('Sección de Llamada a la Acción (CTA)', () => {
    test('debería renderizar el título y el botón de registro para profesionales', () => {
      renderHomePage();

      expect(screen.getByRole('heading', { name: '¿Eres un profesional?' })).toBeInTheDocument();
      const ctaLink = screen.getByRole('link', { name: 'Registrarme como profesional' });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink).toHaveAttribute('href', '/register');
    });
  });
});