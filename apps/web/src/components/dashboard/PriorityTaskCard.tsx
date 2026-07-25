import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Target, Sparkles, ArrowRight } from "lucide-react";
import type { TaskItem } from "../../context/AppContext";

interface PriorityTaskCardProps {
  nextTask?: TaskItem;
}

export const PriorityTaskCard: React.FC<PriorityTaskCardProps> = ({ nextTask }) => {
  return (
    <Card className="mb-6 sm:mb-8 border-l-4 border-l-[var(--primary)] border-t border-r border-b border-[var(--hairline)] bg-[var(--surface-1)] p-4 sm:p-6 w-full overflow-hidden rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--primary)] text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 rounded">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Próxima Atividade Prioritária
            </span>
            <h3 className="text-lg sm:text-xl font-normal text-[var(--ink)] mb-1 break-words">
              {nextTask ? nextTask.title : "Nenhuma atividade pendente"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] break-words">
              {nextTask ? `Vence ${nextTask.due} — Atividade prioritária.` : "Parabéns! Todas as suas tarefas foram concluídas."}
            </p>
          </div>
        </div>
        <Link to="/tarefas" className="no-underline w-full sm:w-auto shrink-0">
          <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2">
            {nextTask ? "Executar Atividade Agora" : "Ver Todas as Atividades"} <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
