import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Volume2, Compass, BookOpen } from "lucide-react";

interface WelcomeBannerProps {
  studentName: string;
  pendingToday: number;
  isSimplified: boolean;
  onSpeakSummary: () => void;
  onStartTour: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  studentName,
  pendingToday,
  isSimplified,
  onSpeakSummary,
  onStartTour,
}) => {
  return (
    <div id="welcome-banner" className="bg-[var(--inverse-canvas)] p-6 sm:p-9 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 w-full rounded-lg border border-[var(--inverse-surface-1)]" role="banner">
      <div className="flex-1">
        {isSimplified && (
          <Badge className="bg-[var(--primary)] text-white font-bold text-xs px-3 py-1 mb-2 border-0">
            ✨ MODO SIMPLIFICADO ATIVO
          </Badge>
        )}
        <h2 className="text-xl sm:text-2xl font-light text-[var(--inverse-ink)] mb-2.5 leading-snug">
          Bom dia, {studentName || "Estudante"}! ☀️🌿
        </h2>
        <p className="text-xs sm:text-sm text-[var(--inverse-ink-muted)] tracking-wide mb-4">
          {pendingToday > 0
            ? `Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
            : "Você está em dia com todas as suas tarefas hoje!"}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="tertiary" 
            onClick={onSpeakSummary}
            className="bg-[var(--inverse-surface-1)] text-[var(--inverse-ink)] border border-[var(--inverse-surface-1)] hover:bg-[var(--primary)] hover:text-white text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[var(--primary)]" /> Ouvir resumo por voz
          </Button>

          <Button 
            variant="tertiary" 
            onClick={onStartTour}
            className="bg-[var(--inverse-surface-1)] text-[var(--inverse-ink)] border border-[var(--inverse-surface-1)] hover:bg-[var(--primary)] hover:text-white text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-[var(--primary)]" /> Ver Tour Guiado
          </Button>
        </div>
      </div>
      <div className="welcome-illustration text-white items-center gap-2 shrink-0 hidden sm:flex" aria-hidden="true">
        <BookOpen className="w-16 h-16 text-[var(--primary)]" />
      </div>
    </div>
  );
};
