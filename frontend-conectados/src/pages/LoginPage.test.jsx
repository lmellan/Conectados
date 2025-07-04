import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';
import '@testing-library/jest-dom';

// --- Mocks (Simulaciones de Dependencias) ---

// 1. Mock de react-router-dom para simular la navegación
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  Link: (props) => <a {...props} href={props.to} />, // Simplificamos Link para el test
}));

// 2. Mock de axios para simular las llamadas a la API
jest.mock('axios');

// 3. Mock de la función `login` del AuthContext
const mockLogin = jest.fn();


// --- Helper de Renderizado ---
// Función auxiliar para renderizar el componente con los contextos necesarios
const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginPage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};


// --- Suite de Tests para la Página de Inicio de Sesión ---
describe('Página de Inicio de Sesión (LoginPage)', () => {

  // Limpiamos todos los mocks antes de cada test para asegurar que las pruebas sean independientes
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería renderizar el formulario de inicio de sesión correctamente', () => {
    renderLoginPage();

    // Verificamos que los elementos principales están en la pantalla
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes una cuenta?/i)).toBeInTheDocument();
  });

  test('debería actualizar los campos de email y contraseña al escribir', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'test@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@ejemplo.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('debería llamar a la API, ejecutar login y navegar al dashboard en un inicio de sesión exitoso', async () => {
    // Datos de prueba para un inicio de sesión exitoso
    const mockEmail = 'usuario@valido.com';
    const mockPassword = 'contrasenaValida';
    const mockUser = { id: 1, nombre: 'Juan' };
    const mockToken = 'jwt-token-valido';

    // Configuramos el mock de axios para que simule una respuesta exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        usuario: mockUser,
        token: mockToken,
      },
    });

    renderLoginPage();

    // Simulamos la entrada del usuario
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: mockEmail } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: mockPassword } });

    // Simulamos el clic en el botón de envío
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    fireEvent.click(submitButton);

    // Esperamos a que el estado de "cargando" aparezca en el botón
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Iniciando...');
    });
    
    // Esperamos a que todas las acciones asíncronas se completen
    await waitFor(() => {
      // Verificamos que se llamó a axios.post con los datos correctos
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        {
          correo: mockEmail,
          contrasena: mockPassword,
        }
      );

      // Verificamos que la función login del contexto fue llamada con los datos del usuario
      expect(mockLogin).toHaveBeenCalledWith(mockUser, mockToken);

      // Verificamos que se navegó a la página correcta
      expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('debería mostrar un mensaje de error si las credenciales son incorrectas', async () => {
    const errorMessage = 'Credenciales inválidas. Por favor, intente de nuevo.';
    // Configuramos el mock de axios para que simule una respuesta de error
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
      },
    });

    renderLoginPage();
    
    // Simulamos la entrada y el envío del formulario
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'usuario@invalido.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'contrasenaInvalida' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
    
    // Esperamos a que el mensaje de error aparezca en la pantalla
    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    
    // Verificamos que NO se intentó hacer login ni navegar
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockedUseNavigate).not.toHaveBeenCalled();

    // Verificamos que el botón vuelve a estar habilitado
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).not.toBeDisabled();
  });

  test('debería tener un enlace a la página de registro', () => {
    renderLoginPage();
    const registerLink = screen.getByText('Regístrate aquí');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});