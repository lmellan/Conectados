import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta

describe('Footer', () => {
  // 1. Renderizado de las secciones principales
  test('debe renderizar las secciones principales del footer: Conectados, Enlaces y Contacto', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /Conectados/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Enlaces/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Contacto/i, level: 3 })).toBeInTheDocument();
  });

  // 2. Renderizado del texto descriptivo de "Conectados"
  test('debe renderizar el texto descriptivo de la sección "Conectados"', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Conectando usuarios con los mejores profesionales para servicios a domicilio./i)
    ).toBeInTheDocument();
  });

  // 3. Renderizado de los enlaces de navegación y sus atributos
  test('debe renderizar los enlaces de navegación con las rutas correctas', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const inicioLink = screen.getByRole('link', { name: /Inicio/i });
    expect(inicioLink).toBeInTheDocument();
    expect(inicioLink).toHaveAttribute('href', '/');

    const buscarServiciosLink = screen.getByRole('link', { name: /Buscar Servicios/i });
    expect(buscarServiciosLink).toBeInTheDocument();
    expect(buscarServiciosLink).toHaveAttribute('href', '/search');

    const ofrecerServiciosLink = screen.getByRole('link', { name: /Ofrecer Servicios/i });
    expect(ofrecerServiciosLink).toBeInTheDocument();
    expect(ofrecerServiciosLink).toHaveAttribute('href', '/register-pro');
  });

  // 4. Renderizado de la información de contacto
  test('debe renderizar la información de contacto (email y teléfono)', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText(/Email: info@conectados.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono: \(123\) 456-7890/i)).toBeInTheDocument();
  });

  // 5. Renderizado del texto de copyright con el año actual
  test('debe renderizar el texto de copyright con el año actual', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Conectados – Servicios a un Clic\. Todos los derechos reservados\.`, 'i'))).toBeInTheDocument();
  });

  // 6. Verificación de clases CSS básicas (opcional, más para integración/estilos)
  test('el footer debe tener la clase de fondo bg-gray-100', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const footerElement = screen.getByRole('contentinfo'); // 'contentinfo' es el rol semántico para <footer>
    expect(footerElement).toHaveClass('bg-gray-100');
  });
});