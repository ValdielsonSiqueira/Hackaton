import React from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

interface TasksProgressProps {
  completedCount: number;
  totalCount: number;
}

export const TasksProgress: React.FC<TasksProgressProps> = ({
  completedCount,
  totalCount,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="bg-[var(--canvas)] border border-[var(--hairline)] mb-6 p-4 sm:p-6 rounded-xl shadow-xs" id="tasks-progress-card">
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="font-semibold text-sm sm:text-base text-[var(--ink)]">
          Progresso do Dia
        </span>
        <span className="text-xs sm:text-sm font-bold text-[var(--primary)]">
          {completedCount} de {totalCount} concluídas ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-3 rounded-full bg-[var(--surface-2)]" />
    </Card>
  );
};
