import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RegisterPage from "./RegisterPage";
import * as mockDataModule from "../data/mockData";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

let mockUsersData = [];

jest.mock('../data/mockData', () => ({
  get users() {
    return mockUsersData;
  },
}));


describe("Página de Registro (RegisterPage)", () => {
  const mockRegister = jest.fn();

  const renderPage = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ register: mockRegister }}>
          <RegisterPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  const fillFormFields = (data) => {
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: data.name },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: data.email },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: data.password },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: data.confirmPassword },
    });
  };

  const getTermsCheckbox = () => screen.getByRole('checkbox', { name: /términos y condiciones/i });
  const getTermsLinkButton = () => screen.getByRole('button', { name: /términos y condiciones/i });
  const getTermsModalTitle = () => screen.getByText('Términos y Condiciones');

  // Helper para simular scroll hasta el final
  const simulateScrollToModalEnd = async () => {
      // Usar document.querySelector para obtener el elemento scrolleable
      const scrollableContent = document.querySelector('.overflow-y-auto');
      if (!scrollableContent) {
          throw new Error("No se encontró el contenido scrolleable del modal.");
      }

      // *** Mockear las propiedades del elemento para simular el scroll ***
      Object.defineProperty(scrollableContent, 'scrollHeight', { value: 500, writable: true }); // Valor total del contenido
      Object.defineProperty(scrollableContent, 'clientHeight', { value: 100, writable: true }); // Altura visible del contenedor
      // Simular scroll casi hasta el final para activar la condición (scrollTop + clientHeight >= scrollHeight - 10)
      Object.defineProperty(scrollableContent, 'scrollTop', { value: 395, writable: true }); // 395 + 100 = 495 >= 500 - 10 (490)


      // Usar act porque fireEvent.scroll puede disparar actualizaciones de estado
      await act(async () => {
          fireEvent.scroll(scrollableContent);
      });

       // Simular scroll *al* final para asegurarse de que canAcceptTerms se establece
       // A veces, se necesitan múltiples eventos o un valor exactamente en el límite.
       // Hagamos un segundo scroll para ser más robustos si la primera no activa
       // (aunque el valor 395+100 debería funcionar para >= 490).
       // O simplemente usar un valor de scrollTop que claramente cumpla la condición.
       Object.defineProperty(scrollableContent, 'scrollTop', { value: 400, writable: true }); // 400 + 100 = 500 >= 490
        await act(async () => {
          fireEvent.scroll(scrollableContent);
       });

        // Limpiar las propiedades mockeadas (opcional, pero buena práctica si no usas restoreAllMocks para todo)
        // Esto es más importante si haces múltiples scrolls en la misma prueba.
        // Para este caso, como el modal se cierra después, no es estrictamente necesario entre scrolls del mismo modal,
        // pero si reutilizaras el mismo elemento scrolleable, sí sería importante.
   };


  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersData = [];
  });


  test("renderiza el formulario completo", () => {
    renderPage();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarme/i })).toBeInTheDocument();
    expect(getTermsCheckbox()).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toHaveAttribute('href', '/login');
  });

  test("muestra error si las contraseñas no coinciden al intentar enviar", async () => {
    renderPage();
    fillFormFields({
      name: "Juan",
      email: "juan@example.com",
      password: "1234",
      confirmPassword: "5678",
    });

    fireEvent.click(getTermsCheckbox());
    await screen.findByText('Términos y Condiciones');

    // *** Usar la helper para simular scroll ***
    await simulateScrollToModalEnd();

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));
    await waitFor(() => expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("muestra error si el email ya está registrado al intentar enviar", async () => {
    mockUsersData = [
        { id: 1, email: "ya@existe.existe", password: "password123", name: "Existente" }
    ];

    renderPage();

    fillFormFields({
      name: "Pedro",
      email: "ya@existe.existe",
      password: "1234",
      confirmPassword: "1234",
    });

    fireEvent.click(getTermsCheckbox());
    await screen.findByText('Términos y Condiciones');

    // *** Usar la helper para simular scroll ***
    await simulateScrollToModalEnd();

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));
    await waitFor(() => expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    await waitFor(() => {
      expect(screen.getByText(/este correo electrónico ya está registrado/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- Pruebas para el Modal de Términos y Condiciones ---

  test("abre el modal de términos y condiciones al hacer clic en el checkbox", async () => {
    renderPage();
    const termsCheckbox = getTermsCheckbox();
    fireEvent.click(termsCheckbox);
    await screen.findByText('Términos y Condiciones');
  });

   test("abre el modal de términos y condiciones al hacer clic en el enlace de texto", async () => {
    renderPage();
    const termsLinkButton = getTermsLinkButton();
    fireEvent.click(termsLinkButton);
    await screen.findByText('Términos y Condiciones');
  });


  test("el botón 'Aceptar' en el modal está inicialmente deshabilitado", async () => {
    renderPage();
    fireEvent.click(getTermsCheckbox());
    await screen.findByText('Términos y Condiciones');

    const acceptButton = screen.getByRole('button', { name: /aceptar/i });
    expect(acceptButton).toBeDisabled();
  });

  test("scrollear el contenido del modal habilita el botón 'Aceptar'", async () => {
    renderPage();
    fireEvent.click(getTermsCheckbox());
    await screen.findByText('Términos y Condiciones');

    const acceptButton = screen.getByRole('button', { name: /aceptar/i });
    expect(acceptButton).toBeDisabled(); // Asegurarse de que está deshabilitado antes del scroll

    // *** Usar la helper para simular scroll ***
    await simulateScrollToModalEnd();

    // Esperar a que el botón se habilite (puede tomar un ciclo de evento)
     await waitFor(() => {
        expect(acceptButton).toBeEnabled();
     });
  });

  test("hacer clic en 'Aceptar' en el modal cierra el modal y acepta los términos", async () => {
    renderPage();
    const termsCheckbox = getTermsCheckbox();
    fireEvent.click(termsCheckbox);
    await screen.findByText('Términos y Condiciones');

    // *** Usar la helper para simular scroll ***
    await simulateScrollToModalEnd();

    const acceptButton = screen.getByRole('button', { name: /aceptar/i });
     await act(async () => {
        fireEvent.click(acceptButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument();
    });
    expect(termsCheckbox).toBeChecked();
  });

   test("hacer clic en 'Cancelar' en el modal cierra el modal pero no acepta los términos", async () => {
    renderPage();
    const termsCheckbox = getTermsCheckbox();
    fireEvent.click(termsCheckbox);
    await screen.findByText('Términos y Condiciones');

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });

    expect(termsCheckbox).not.toBeChecked();

    await act(async () => {
       fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument();
    });

    expect(termsCheckbox).not.toBeChecked();
  });


  // --- Prueba de Registro Exitoso (Actualizada) ---

  test("registra correctamente y redirige al dashboard después de aceptar los términos", async () => {
    renderPage();

    fillFormFields({
      name: "María",
      email: "maria@example.com",
      password: "abcd",
      confirmPassword: "abcd",
    });

    const termsCheckbox = getTermsCheckbox();
    expect(termsCheckbox).not.toBeChecked();

    fireEvent.click(termsCheckbox);

    await screen.findByText('Términos y Condiciones');

    // *** Usar la helper para simular scroll ***
    await simulateScrollToModalEnd();

    const acceptButton = screen.getByRole('button', { name: /aceptar/i });
    expect(acceptButton).toBeEnabled();
     await act(async () => {
       fireEvent.click(acceptButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument();
      expect(getTermsCheckbox()).toBeChecked();
    });

    const submitButton = screen.getByRole("button", { name: /registrarme/i });
     await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockRegister).toHaveBeenCalledTimes(1);
    const registeredUserData = mockRegister.mock.calls[0][0];
    expect(registeredUserData).toHaveProperty('name', 'María');
    expect(registeredUserData).toHaveProperty('email', 'maria@example.com');
    expect(registeredUserData).toHaveProperty('password', 'abcd');
    expect(registeredUserData).toHaveProperty('isProfessional', false);
    expect(registeredUserData).toHaveProperty('image', "https://randomuser.me/api/portraits/lego/1.jpg");

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
  });

   test("muestra error y NO registra si los términos no están aceptados", async () => {
       renderPage();

       fillFormFields({
         name: "Usuario No Terminos",
         email: "noterms@example.com",
         password: "123",
         confirmPassword: "123",
       });

       const termsCheckbox = getTermsCheckbox();
       expect(termsCheckbox).not.toBeChecked();

       const submitButton = screen.getByRole("button", { name: /registrarme/i });

       await act(async () => {
          fireEvent.click(submitButton);
       });

       // Esperar a que el mensaje de error aparezca
       // Esto asume que has añadido la lógica en handleSubmit
       await waitFor(() => {
           expect(screen.getByText(/debes aceptar los términos y condiciones/i)).toBeInTheDocument();
       });

       expect(mockRegister).not.toHaveBeenCalled();
       expect(mockNavigate).not.toHaveBeenCalled();
   });

});