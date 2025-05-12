import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  const baseProps = {
    title: "¿Eliminar usuario?",
    message: "Esta acción no se puede deshacer.",
    confirmText: "Sí, eliminar",
    cancelText: "Cancelar",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el título y el mensaje", () => {
    render(<ConfirmationModal {...baseProps} />);
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.message)).toBeInTheDocument();
  });

  test("muestra botones con los textos personalizados", () => {
    render(<ConfirmationModal {...baseProps} />);
    expect(screen.getByText("Sí, eliminar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  test("llama a onConfirm al hacer clic en Confirmar", async () => {
    render(<ConfirmationModal {...baseProps} />);
    await userEvent.click(screen.getByText("Sí, eliminar"));
    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  test("llama a onCancel al hacer clic en Cancelar", async () => {
    render(<ConfirmationModal {...baseProps} />);
    await userEvent.click(screen.getByText("Cancelar"));
    expect(baseProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test("no renderiza el botón Cancelar si showCancel es false", () => {
    render(<ConfirmationModal {...baseProps} showCancel={false} />);
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
  });

  test("botón Confirmar tiene clase destructiva si isDestructive es true", () => {
    render(<ConfirmationModal {...baseProps} isDestructive={true} />);
    const confirmBtn = screen.getByText("Sí, eliminar");
    expect(confirmBtn).toHaveClass("bg-red-600");
  });

  test("botón Confirmar tiene clase segura si isDestructive es false", () => {
    render(<ConfirmationModal {...baseProps} isDestructive={false} />);
    const confirmBtn = screen.getByText("Sí, eliminar");
    expect(confirmBtn).toHaveClass("bg-green-600");
  });
});
