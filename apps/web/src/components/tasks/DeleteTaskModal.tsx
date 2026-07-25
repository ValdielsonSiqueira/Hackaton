import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import type { TaskItem } from "../../context/AppContext";

interface DeleteTaskModalProps {
  task: TaskItem | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  onConfirm,
  onClose,
}) => {
  if (!task) return null;

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="delete-task-modal-heading">
      <div className="modal-box p-6 max-w-md mx-auto w-[90vw] text-center border-t-4 border-t-[#da1e28]">
        <div className="w-12 h-12 bg-[#fff0f0] rounded-full flex items-center justify-center mx-auto mb-4 text-[#da1e28]">
          <Trash2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 id="delete-task-modal-heading" className="text-xl font-bold text-[var(--ink)] mb-2">
          Tem certeza que deseja excluir?
        </h3>
        <p className="text-sm text-[var(--ink-muted)] mb-6">
          A atividade <strong>"{task.title}"</strong> será removida permanentemente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            id="confirm-delete-btn"
            onClick={onConfirm}
            className="w-full bg-[#da1e28] hover:bg-[#ba1b23] border-[#da1e28] text-white flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Sim, excluir atividade
          </Button>
          <Button
            variant="tertiary"
            id="cancel-delete-btn"
            onClick={onClose}
            className="w-full flex items-center justify-center"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
