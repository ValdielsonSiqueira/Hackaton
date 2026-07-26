import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreateTaskModal } from "../CreateTaskModal";

describe("CreateTaskModal Component", () => {
  it("should validate required task name before calling onSaveTask", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();
    const handleToast = vi.fn();

    render(
      <CreateTaskModal
        editingTask={null}
        isOpen={true}
        onClose={handleClose}
        onSaveTask={handleSave}
        onTriggerToast={handleToast}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Salvar Atividade/i });
    fireEvent.click(submitBtn);

    expect(handleSave).not.toHaveBeenCalled();
    expect(handleToast).toHaveBeenCalledWith(expect.stringContaining("Insira um nome para a atividade"));
  });

  it("should allow choosing priority and submitting a valid new task", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <CreateTaskModal
        editingTask={null}
        isOpen={true}
        onClose={handleClose}
        onSaveTask={handleSave}
        onTriggerToast={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/1. Nome da Atividade/i);
    fireEvent.change(nameInput, { target: { value: "Estudar para Prova de Software" } });

    const urgentBtn = screen.getByRole("button", { name: /Urgente/i });
    fireEvent.click(urgentBtn);

    const submitBtn = screen.getByRole("button", { name: /Salvar Atividade/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Estudar para Prova de Software",
        priority: "high",
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
