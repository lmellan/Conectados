import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProProfilePage from './ProProfilePage';
import '@testing-library/jest-dom';

// --- Mocks de Dependencias ---

// Mock de react-router-dom para proveer un ID de profesional
// Usaremos jest.fn() para poder cambiar el ID en cada test.
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  Link: (props) => <a {...props} href={props.to} />,
}));

// Mock de los datos para tener control total
jest.mock('../data/mockData', () => ({
  users: [
    { id: 1, name: 'Juan El Gasfiter', correo: 'juan@gasfiter.com', isProfessional: true, profession: 'Plomería', availability: [1, 2, 3, 4, 5], hourlyRate: 25000, description: 'Experto en fugas.' },
    { id: 2, name: 'Ana La Electricista', correo: 'ana@electric.com', isProfessional: true, profession: 'Electricidad', availability: [1, 3, 5], hourlyRate: 30000 },
    { id: 3, name: 'Pedro Sin Servicios', isProfessional: true, profession: 'Carpintería' },
  ],
  services: [
    { id: 101, providerId: 1, title: 'Reparación de Fugas' },
    { id: 102, providerId: 1, title: 'Instalación de Grifos' },
    { id: 201, providerId: 2, title: 'Instalación Eléctrica' },
  ],
  testimonials: [
    { id: 1, userName: 'Cliente Satisfecho', rating: 5, text: 'Excelente trabajo con los grifos.', service: 'Instalación de Grifos' },
    { id: 2, userName: 'Otro Cliente', rating: 4, text: 'Resolvió la fuga rápidamente.', service: 'Plomería' },
    { id: 3, userName: 'Cliente de Ana', rating: 5, text: 'Muy profesional.', service: 'Electricidad' },
  ],
}));

// Mocks de Componentes Hijos
jest.mock('../components/AvailabilityCalendar', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="mock-calendar">Calendario de Disponibilidad</div>;
});

jest.mock('../components/ServiceCard', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ service }) => <div data-testid="mock-service-card">{service.title}</div>;
});

// Hacemos un mock más específico para StarRatingDisplay para poder verificar el rating que recibe
jest.mock('../components/StarRatingDisplay', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return ({ rating }) => <div data-testid="mock-star-rating">Rating: {rating}</div>;
});


// --- Suite de Tests para la Página de Perfil de Profesional ---
describe('Página de Perfil de Profesional (ProProfilePage)', () => {
  // Usamos timers falsos para controlar el setTimeout del componente
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const renderProProfilePage = () => {
    return render(
      <BrowserRouter>
        <ProProfilePage />
      </BrowserRouter>
    );
  };

  test('debería mostrar el estado de carga inicialmente', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderProProfilePage();
    expect(screen.getByText('Cargando perfil del profesional...')).toBeInTheDocument();
  });

  test('debería mostrar un mensaje de "Profesional no encontrado" si el ID no es válido', async () => {
    mockUseParams.mockReturnValue({ id: '999' }); // Un ID que no existe
    renderProProfilePage();

    // Avanzamos los timers para que se complete el "fetch" simulado
    act(() => {
      jest.runAllTimers();
    });

    expect(await screen.findByText('Profesional no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a la búsqueda' })).toHaveAttribute('href', '/search');
  });

  test('debería mostrar el perfil completo del profesional después de cargar', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderProProfilePage();

    act(() => {
      jest.runAllTimers();
    });

    // Verificamos que los datos principales del profesional se muestran
    expect(await screen.findByRole('heading', { name: 'Juan El Gasfiter' })).toBeInTheDocument();
    expect(screen.getByText('juan@gasfiter.com')).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
    expect(screen.getByText('Experto en fugas.')).toBeInTheDocument();
    
    // Verificamos que los componentes hijos simulados se renderizan
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
  });

  test('debería mostrar solo los servicios que pertenecen al profesional', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderProProfilePage();

    act(() => {
      jest.runAllTimers();
    });

    // Esperamos a que la sección de servicios aparezca
    await screen.findByRole('heading', { name: 'Servicios Ofrecidos' });

    const serviceCards = screen.getAllByTestId('mock-service-card');
    expect(serviceCards).toHaveLength(2); // Juan tiene 2 servicios
    expect(screen.getByText('Reparación de Fugas')).toBeInTheDocument();
    expect(screen.getByText('Instalación de Grifos')).toBeInTheDocument();
    expect(screen.queryByText('Instalación Eléctrica')).not.toBeInTheDocument(); // Este servicio no es de Juan
  });

  test('debería calcular la calificación general y mostrar las reseñas correctas', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    renderProProfilePage();

    act(() => {
      jest.runAllTimers();
    });

    await screen.findByRole('heading', { name: 'Reseñas' });

    // Verificamos las reseñas filtradas
    const testimonialUsers = screen.getAllByText(/Cliente/);
    expect(testimonialUsers).toHaveLength(2); // Se filtran 2 testimonios para Juan
    expect(screen.getByText(/Excelente trabajo con los grifos/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolvió la fuga rápidamente/i)).toBeInTheDocument();
    expect(screen.queryByText(/Muy profesional/i)).not.toBeInTheDocument(); // Testimonio de Ana

    // Verificamos el cálculo del rating y el ajuste (multiplicación por 2)
    // Rating promedio de Juan: (5 + 4) / 2 = 4.5. Lógica de negocio: 4.5 * 2 = 9.
    const starDisplays = screen.getAllByTestId('mock-star-rating');
    // El primer display de estrellas es el general
    expect(starDisplays[0]).toHaveTextContent('Rating: 9'); 
    // Los siguientes son de cada reseña
    expect(starDisplays[1]).toHaveTextContent('Rating: 10'); // Testimonio de 5 * 2
    expect(starDisplays[2]).toHaveTextContent('Rating: 8');  // Testimonio de 4 * 2
  });

  test('debería mostrar un mensaje cuando el profesional no tiene servicios publicados', async () => {
    mockUseParams.mockReturnValue({ id: '3' }); // Pedro no tiene servicios
    renderProProfilePage();

    act(() => {
      jest.runAllTimers();
    });
    
    expect(await screen.findByText('Este profesional aún no ha publicado servicios.')).toBeInTheDocument();
  });
});