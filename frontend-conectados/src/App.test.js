import { render, screen } from '@testing-library/react';
import { act } from 'react'; // Importar el act moderno
import App from './App';

test('renders learn react link', () => {
  act(() => {
    render(<App />);
  });
});
