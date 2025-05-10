import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  test('renders title and message', () => {
    render(
      <ConfirmationModal
        title="Confirmación"
        message="¿Estás seguro de continuar?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Confirmación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de continuar?')).toBeInTheDocument();
  });

  test('renders confirm and cancel buttons with correct text', () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        confirmText="Sí"
        cancelText="No"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Sí')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('does not render cancel button when showCancel is false', () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        showCancel={false}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const cancelButton = screen.queryByText('Cancelar');
    expect(cancelButton).not.toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const handleConfirm = jest.fn();

    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    );

    const confirmButton = screen.getByText('Confirmar');
    await userEvent.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const handleCancel = jest.fn();

    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await userEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('confirm button has red background when isDestructive is true', () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        isDestructive={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const confirmButton = screen.getByText('Confirmar');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  test('confirm button has green background when isDestructive is false', () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Mensaje"
        isDestructive={false}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const confirmButton = screen.getByText('Confirmar');
    expect(confirmButton).toHaveClass('bg-green-600');
  });
});
