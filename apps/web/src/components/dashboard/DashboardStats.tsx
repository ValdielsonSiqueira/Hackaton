import React from "react";
import { Card } from "../ui/card";
import { CheckCircle2, Clock, Flame } from "lucide-react";

interface DashboardStatsProps {
  completedToday: number;
  pendingToday: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  completedToday,
  pendingToday,
}) => {
  return (
    <div id="dashboard-stats-row" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full" role="list" aria-label="Resumo das suas atividades">
      <Card className="bg-[var(--canvas)] p-5 sm:p-7 rounded-lg border border-[var(--hairline)] shadow-sm" role="listitem">
        <CheckCircle2 className="w-7 h-7 text-[var(--success)] mb-3" aria-hidden="true" />
        <div className="text-4xl sm:text-5xl font-light text-[var(--success)] tracking-tight leading-none mb-1.5">{completedToday}</div>
        <div className="text-xs sm:text-sm text-[var(--ink-muted)] tracking-wide">Concluídas hoje</div>
      </Card>
      <Card className="bg-[var(--canvas)] p-5 sm:p-7 rounded-lg border border-[var(--hairline)] shadow-sm" role="listitem">
        <Clock className="w-7 h-7 text-[var(--ink)] mb-3" aria-hidden="true" />
        <div className="text-4xl sm:text-5xl font-light text-[var(--ink)] tracking-tight leading-none mb-1.5">{pendingToday}</div>
        <div className="text-xs sm:text-sm text-[var(--ink-muted)] tracking-wide">Pendentes</div>
      </Card>
      <Card className="bg-[var(--canvas)] p-5 sm:p-7 rounded-lg border border-[var(--hairline)] shadow-sm" role="listitem">
        <Flame className="w-7 h-7 text-[var(--primary)] mb-3" aria-hidden="true" />
        <div className="text-4xl sm:text-5xl font-light text-[var(--primary)] tracking-tight leading-none mb-1.5">7</div>
        <div className="text-xs sm:text-sm text-[var(--ink-muted)] tracking-wide">Dias seguidos</div>
      </Card>
    </div>
  );
};
