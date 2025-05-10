import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock del hook useNavigate
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe('SearchBar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Cada test tendrá su propio mock limpio
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button', () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('¿Qué servicio necesitas?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  test('allows user to type in the input', async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('¿Qué servicio necesitas?');
    await userEvent.type(input, 'electricidad');

    expect(input).toHaveValue('electricidad');
  });

  test('navigates to search page on submit', async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('¿Qué servicio necesitas?');
    const button = screen.getByRole('button', { name: /buscar/i });

    await userEvent.type(input, 'plomeria');
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=plomeria');
  });
});
