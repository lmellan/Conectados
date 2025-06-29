import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // Ajusta la ruta si es necesario

// Mock de useNavigate
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantiene otras exportaciones reales
  useNavigate: () => mockedUseNavigate, // Sobrescribe useNavigate con nuestro mock
}));

describe('SearchBar', () => {
  // Limpiar todos los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Renderiza el input de búsqueda y el botón
  test('debe renderizar el campo de entrada de búsqueda y un botón "Buscar"', () => {
    render(<SearchBar />);

    expect(screen.getByPlaceholderText('¿Qué servicio necesitas?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  // 2. Actualiza el estado de searchTerm al cambiar el input
  test('debe actualizar el valor del input cuando el usuario escribe', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('¿Qué servicio necesitas?');

    fireEvent.change(searchInput, { target: { value: 'electricista' } });

    expect(searchInput).toHaveValue('electricista');
  });

  // 3. Navega a los resultados de búsqueda con la consulta correcta al enviar el formulario
  test('debe navegar a la página de resultados de búsqueda con la consulta correcta al enviar el formulario', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('¿Qué servicio necesitas?');
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    // Escribe un término de búsqueda
    fireEvent.change(searchInput, { target: { value: 'plomería' } });

    // Envía el formulario
    fireEvent.click(searchButton); // Al hacer clic en el botón de enviar se activa el envío del formulario

    // Verifica que navigate fue llamado con la ruta correcta
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/search?q=plomería');
  });

  // 4. Maneja el envío de términos de búsqueda vacíos (debe navegar, pero con la consulta vacía)
  test('debe navegar a la búsqueda con una consulta vacía si el término de búsqueda está vacío', () => {
    render(<SearchBar />);
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    // No escribas nada, simplemente envía
    fireEvent.click(searchButton);

    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/search?q=');
  });

  // 5. Aplica la className personalizada pasada a través de las props
  test('debe aplicar la className personalizada pasada a través de las props al formulario', () => {
    const customClassName = 'my-custom-search-bar';
    render(<SearchBar className={customClassName} />);

    // Ahora screen.getByRole('form', { name: 'Buscador de servicios' }) funcionará
    // porque añadimos el aria-label al formulario en SearchBar.jsx
    const formElement = screen.getByRole('form', { name: 'Buscador de servicios' });
    expect(formElement).toHaveClass(customClassName);
  });
});