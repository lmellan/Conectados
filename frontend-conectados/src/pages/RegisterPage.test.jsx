import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import '@testing-library/jest-dom';

// --- Mocks (Simulaciones de Dependencias) ---

// 1. Mock de react-router-dom para simular la navegación
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  Link: (props) => <a {...props} href={props.to} />, // Simplificamos Link para el test
}));

// 2. Mock del API fetch global para interceptar las llamadas
global.fetch = jest.fn();


// --- Helper de Renderizado ---
const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
};


// --- Suite de Tests para la Página de Registro ---
describe('Página de Registro (RegisterPage)', () => {

  // Limpiamos los mocks antes de cada test para asegurar el aislamiento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería renderizar todos los campos del formulario y el botón de registro', () => {
    renderRegisterPage();

    expect(screen.getByRole('heading', { name: 'Crear una cuenta' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de celular/)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarme' })).toBeInTheDocument();
  });

  test('debería actualizar los campos del formulario al llenarlos', () => {
    renderRegisterPage();

    const nombreInput = screen.getByLabelText('Nombre completo');
    fireEvent.change(nombreInput, { target: { value: 'Juan Perez' } });
    expect(nombreInput).toHaveValue('Juan Perez');
  });

  test('debería mostrar un error si las contraseñas no coinciden', async () => {
    renderRegisterPage();
    
    // Llenamos el formulario con contraseñas que no coinciden
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Número de celular/), { target: { value: '56912345678' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'password456' } });

    // Hacemos clic en el botón de registrar
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    // Esperamos que el mensaje de error aparezca
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
    
    // Verificamos que no se intentó hacer la llamada a la API
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('debería mostrar un error si el formato del número de celular es incorrecto', async () => {
    renderRegisterPage();

    // Llenamos el formulario con un número inválido
    fireEvent.change(screen.getByLabelText(/Número de celular/), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    
    expect(await screen.findByText('El número de celular debe ser en el formato 569XXXXXXXX')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('debería enviar el formulario y navegar a /login en un registro exitoso', async () => {
    // Simulamos una respuesta exitosa del API
    global.fetch.mockResolvedValueOnce({
      ok: true,
    });

    renderRegisterPage();

    // Llenamos el formulario con datos válidos
    const nombre = 'Usuario Valido';
    const correo = 'valido@ejemplo.com';
    const numero = '56987654321';
    const contrasena = 'contrasenaSegura123';

    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: nombre } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: correo } });
    fireEvent.change(screen.getByLabelText(/Número de celular/), { target: { value: numero } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: contrasena } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: contrasena } });

    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    // Esperamos a que la llamada a la API se realice
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Verificamos que el body enviado es correcto y no incluye 'confirmPassword'
          body: JSON.stringify({
            nombre,
            correo,
            contrasena,
            numero,
          }),
        })
      );
    });

    // Verificamos que se navegó a la página de login
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('debería mostrar un mensaje de error de la API si el registro falla', async () => {
    const errorApi = 'El correo ya está en uso.';
    // Simulamos una respuesta de error del API
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ message: errorApi }), // Simulamos una respuesta JSON con el error
    });

    renderRegisterPage();

    // Llenamos el formulario con datos válidos para que pase las validaciones locales
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Usuario Repetido' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'repetido@ejemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Número de celular/), { target: { value: '56911223344' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

    // Verificamos que el mensaje de error del API se muestra en pantalla
    expect(await screen.findByText(errorApi)).toBeInTheDocument();
    
    // Verificamos que no hubo navegación
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });
});