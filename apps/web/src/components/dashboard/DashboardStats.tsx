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
    <div className="stats-row" role="list" aria-label="Resumo das suas atividades" style={{ marginTop: "1px" }}>
      <Card className="stat-card" role="listitem">
        <CheckCircle2 className="w-7 h-7 text-[#24a148] mb-3" aria-hidden="true" />
        <div className="stat-number green">{completedToday}</div>
        <div className="stat-label">Concluídas hoje</div>
      </Card>
      <Card className="stat-card" role="listitem">
        <Clock className="w-7 h-7 text-[#161616] mb-3" aria-hidden="true" />
        <div className="stat-number">{pendingToday}</div>
        <div className="stat-label">Pendentes</div>
      </Card>
      <Card className="stat-card" role="listitem">
        <Flame className="w-7 h-7 text-[#0f62fe] mb-3" aria-hidden="true" />
        <div className="stat-number blue">7</div>
        <div className="stat-label">Dias seguidos</div>
      </Card>
    </div>
  );
};
