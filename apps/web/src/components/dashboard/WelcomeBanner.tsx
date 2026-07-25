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
    <div className="welcome-banner" role="banner">
      <div className="welcome-text" style={{ flex: 1 }}>
        {isSimplified && (
          <Badge className="bg-white text-[#0f62fe] font-bold text-xs px-3 py-1 mb-2">
            ✨ MODO SIMPLIFICADO ATIVO
          </Badge>
        )}
        <h2>Bom dia, {studentName || "Estudante"}! ☀️🌿</h2>
        <p className="mb-4">
          {pendingToday > 0
            ? `Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
            : "Você está em dia com todas as suas tarefas hoje!"}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="tertiary" 
            onClick={onSpeakSummary}
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-white" /> Ouvir resumo por voz
          </Button>

          <Button 
            variant="tertiary" 
            onClick={onStartTour}
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-white" /> Ver Tour Guiado
          </Button>
        </div>
      </div>
      <div className="welcome-illustration text-white flex items-center gap-2" aria-hidden="true">
        <BookOpen className="w-16 h-16 text-[#0f62fe]" />
      </div>
    </div>
  );
};
