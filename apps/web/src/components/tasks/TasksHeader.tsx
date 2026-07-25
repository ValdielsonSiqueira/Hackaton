import React from "react";
import { Button } from "../ui/button";
import { Plus, Compass } from "lucide-react";
import { startTasksTour } from "../../utils/tour";

interface TasksHeaderProps {
  onOpenCreateModal: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
          Minhas Atividades e Trabalhos
        </h2>
        <p className="text-sm text-[var(--ink-muted)]">
          Acompanhe suas leituras e prazos de forma simples e acessível
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="tertiary"
          onClick={() => startTasksTour()}
          className="flex items-center gap-2 text-sm h-10 px-3 border-[var(--hairline)] text-[var(--ink)] hover:bg-[var(--surface-1)]"
          title="Ver Tour Guiado das Atividades"
          aria-label="Ver Tour Guiado das Atividades"
        >
          <Compass className="w-4 h-4 text-[var(--primary)]" /> Tour Guiado
        </Button>

        <Button
          id="btn-new-task"
          variant="primary"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 text-sm h-10 px-4"
        >
          <Plus className="w-4 h-4" /> Nova Atividade
        </Button>
      </div>
    </div>
  );
};
