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
    <div id="welcome-banner" className="bg-[var(--inverse-canvas)] p-5 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 w-full rounded-lg border border-[var(--inverse-surface-1)]" role="banner">
      <div className="flex-1 w-full">
        {isSimplified && (
          <Badge className="bg-[var(--primary)] text-white font-bold text-xs px-3 py-1 mb-2 border-0">
            ✨ MODO SIMPLIFICADO ATIVO
          </Badge>
        )}
        <h2 className="text-xl sm:text-2xl font-light text-[var(--inverse-ink)] mb-2.5 leading-snug break-words">
          Bom dia, {studentName || "Estudante"}! ☀️🌿
        </h2>
        <p className="text-xs sm:text-sm text-[var(--inverse-ink-muted)] tracking-wide mb-4 leading-relaxed break-words">
          {pendingToday > 0
            ? `Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
            : "Você está em dia com todas as suas tarefas hoje!"}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="tertiary" 
            onClick={onSpeakSummary}
            className="bg-[var(--inverse-surface-1)] text-[var(--inverse-ink)] border border-[var(--inverse-surface-1)] hover:bg-[var(--primary)] hover:text-white text-sm min-h-[44px] h-auto py-2.5 px-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors cursor-pointer text-center leading-normal"
          >
            <Volume2 className="w-4 h-4 text-[var(--primary)] shrink-0" /> <span className="break-words">Ouvir resumo por voz</span>
          </Button>

          <Button 
            variant="tertiary" 
            onClick={onStartTour}
            className="bg-[var(--inverse-surface-1)] text-[var(--inverse-ink)] border border-[var(--inverse-surface-1)] hover:bg-[var(--primary)] hover:text-white text-sm min-h-[44px] h-auto py-2.5 px-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors cursor-pointer text-center leading-normal"
          >
            <Compass className="w-4 h-4 text-[var(--primary)] shrink-0" /> <span className="break-words">Ver Tour Guiado</span>
          </Button>
        </div>
      </div>
      <div className="welcome-illustration text-white items-center gap-2 shrink-0 hidden sm:flex" aria-hidden="true">
        <BookOpen className="w-16 h-16 text-[var(--primary)]" />
      </div>
    </div>
  );
};
