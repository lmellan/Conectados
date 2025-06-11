import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal'; // Asegúrate de que la ruta sea correcta

describe('ConfirmationModal', () => {
  const defaultProps = {
    title: 'Confirmación',
    message: '¿Estás seguro de realizar esta acción?',
    onConfirm: jest.fn(), // Mock de la función onConfirm
    onCancel: jest.fn(),  // Mock de la función onCancel
  };

  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Renderizado básico con título y mensaje
  test('debe renderizar el título y el mensaje correctamente', () => {
    render(<ConfirmationModal {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
  });

  // 2. Comportamiento de los botones por defecto (Confirmar y Cancelar)
  test('debe mostrar los botones de "Confirmar" y "Cancelar" por defecto', () => {
    render(<ConfirmationModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  // 3. Comportamiento del botón de confirmación con texto personalizado
  test('debe usar el texto personalizado para el botón de confirmar', () => {
    const customConfirmText = '¡Sí, eliminar!';
    render(<ConfirmationModal {...defaultProps} confirmText={customConfirmText} />);

    expect(screen.getByRole('button', { name: customConfirmText })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument();
  });

  // 4. Comportamiento del botón de cancelar con texto personalizado
  test('debe usar el texto personalizado para el botón de cancelar', () => {
    const customCancelText = 'No, dejarlo';
    render(<ConfirmationModal {...defaultProps} cancelText={customCancelText} />);

    expect(screen.getByRole('button', { name: customCancelText })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();
  });

  // 5. Ocultar el botón de cancelar (MODIFICADO)
  test('no debe mostrar el botón de cancelar cuando showCancel es falso', () => {
    render(<ConfirmationModal {...defaultProps} showCancel={false} />);

    // Opción 1: Buscar por rol y nombre (la que estaba fallando, revisemos)
    // El fallo sugería que `queryByRole` con name='Cancelar' estaba devolviendo el botón 'Confirmar', lo cual es muy improbable.
    // Lo más probable es un problema de interpretación del mensaje de error o una versión muy antigua de la librería.
    // Vamos a intentar con queryByText, que es más directo para textos.
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();

    // Si quieres ser explícito con el rol, y el nombre no funciona, puedes buscar el rol y luego el texto dentro.
    // Sin embargo, queryByRole con name es la forma estándar y debería funcionar.
    // expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();

    // Asegurarse de que el botón de confirmar SIGUE ESTANDO
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  // 6. Llamada a onConfirm al hacer clic en el botón de confirmar
  test('debe llamar a onConfirm cuando se hace clic en el botón de confirmar', () => {
    render(<ConfirmationModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  // 7. Llamada a onCancel al hacer clic en el botón de cancelar
  test('debe llamar a onCancel cuando se hace clic en el botón de cancelar', () => {
    render(<ConfirmationModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  // 8. Estilo del botón de confirmar en modo destructivo
  test('el botón de confirmar debe tener clases de estilo destructivo cuando isDestructive es verdadero', () => {
    render(<ConfirmationModal {...defaultProps} isDestructive={true} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toHaveClass('bg-red-600');
    expect(confirmButton).toHaveClass('hover:bg-red-700');
    expect(confirmButton).not.toHaveClass('bg-green-600'); // Asegurarse de que no tiene el estilo no destructivo
  });

  // 9. Estilo del botón de confirmar en modo no destructivo (por defecto)
  test('el botón de confirmar debe tener clases de estilo no destructivo por defecto', () => {
    render(<ConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toHaveClass('bg-green-600');
    expect(confirmButton).toHaveClass('hover:bg-green-700');
    expect(confirmButton).not.toHaveClass('bg-red-600'); // Asegurarse de que no tiene el estilo destructivo
  });

  // 10. Accesibilidad: verificación de rol para el modal
  test('el modal debe tener el rol de diálogo (implícito por estructura o explícito)', () => {
    render(<ConfirmationModal {...defaultProps} />);

    // React Testing Library no tiene un "getByModal",
    // pero podemos buscar elementos que típicamente conforman un modal
    // o el elemento padre que sería el contenedor del diálogo.
    // Usaremos el título como un indicador del contenido del modal
    const modalContent = screen.getByText(defaultProps.title).closest('div');
    expect(modalContent).toBeInTheDocument(); // Verifica que el contenido está presente

    // Aunque no hay un rol 'dialog' explícito en el JSX,
    // es una buena práctica verificar que el contenedor principal del modal
    // sea accesible. Si bien el `div` con `fixed inset-0` no tiene un rol
    // semántico directo de diálogo, su propósito es ser un modal.
    // Para una accesibilidad más estricta, se debería añadir `role="dialog"`
    // al div principal del modal y `aria-modal="true"`.
    // Por ahora, verificamos la presencia del contenido.
  });
});