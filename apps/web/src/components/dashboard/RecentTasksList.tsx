import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  BookOpen, 
  Video, 
  MessageSquare, 
  FileCheck, 
  Plus, 
  Volume2 
} from "lucide-react";
import type { TaskItem } from "../../context/AppContext";

import { speakTaskDetails } from "../../services/speech";

interface RecentTasksListProps {
  tasks: TaskItem[];
  onTriggerToast: (msg: string) => void;
}

export const RecentTasksList: React.FC<RecentTasksListProps> = ({
  tasks,
  onTriggerToast,
}) => {
  const getActivityIcon = (category: string) => {
    const cat = (category || "").toUpperCase();
    if (cat.includes("AULA") || cat.includes("ONLINE")) return <Video className="w-5 h-5 text-[var(--primary)]" />;
    if (cat.includes("LEITURA")) return <BookOpen className="w-5 h-5 text-[var(--primary)]" />;
    if (cat.includes("PARTICIPAÇ") || cat.includes("FÓRUM")) return <MessageSquare className="w-5 h-5 text-[var(--success)]" />;
    return <FileCheck className="w-5 h-5 text-[var(--ink)]" />;
  };

  const handleSpeakTask = (task: TaskItem) => {
    const success = speakTaskDetails(task.title, task.category, task.due, task.done);
    if (success) {
      onTriggerToast(`🔊 Lendo: "${task.title}"`);
    } else {
      onTriggerToast("Navegador não suporta voz nativa");
    }
  };

  return (
    <div id="recent-activity-section" className="mt-8 sm:mt-10 p-4 sm:p-5 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-medium text-[var(--ink)]">Minhas Atividades Recentes ({tasks.length})</h2>
        <Link to="/tarefas" className="no-underline w-full sm:w-auto">
          <Button variant="tertiary" size="sm" className="text-xs min-h-[38px] h-auto py-2 px-3 flex items-center justify-center gap-1.5 bg-[var(--canvas)] border border-[var(--hairline)] w-full sm:w-auto cursor-pointer">
            <Plus className="w-4 h-4 text-[var(--primary)] shrink-0" /> Adicionar / Ver Todas
          </Button>
        </Link>
      </div>

      <Card id="recent-activity-card" className="bg-[var(--canvas)] border border-[var(--hairline)] p-2 sm:p-4 rounded-lg shadow-xs">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-[var(--ink-muted)]">
            <p className="text-base mb-3 font-medium">Nenhuma atividade cadastrada no momento.</p>
            <Link to="/tarefas">
              <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Criar Primeira Atividade
              </Button>
            </Link>
          </div>
        ) : (
          tasks.slice(0, 5).map((t) => (
            <div 
              key={t.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-1)] transition-colors gap-3 rounded ${
                t.done ? "opacity-75 bg-[var(--surface-1)]" : ""
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleSpeakTask(t)}
                  className="w-8 h-8 rounded-full bg-[var(--canvas)] border border-[var(--hairline)] hover:bg-[var(--primary)] hover:text-white flex items-center justify-center shrink-0 text-[var(--primary)] cursor-pointer transition-colors mt-0.5 sm:mt-0"
                  aria-label={`Ouvir detalhes da atividade ${t.title}`}
                  title="Ouvir atividade"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div className="p-2 rounded bg-[var(--surface-1)] border border-[var(--hairline)] shrink-0 mt-0.5 sm:mt-0">
                  {getActivityIcon(t.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="break-words text-sm sm:text-base font-medium text-[var(--ink)] leading-snug">{t.title}</div>
                  <div className="text-xs text-[var(--ink-muted)] mt-1 break-words">{t.done ? `Concluído (${t.due})` : `Até ${t.due}`}</div>
                </div>
              </div>
              <div className="self-start sm:self-center shrink-0">
                <Badge variant={t.done ? "success" : "pending"} className="text-xs px-3 py-1 inline-flex items-center">
                  {t.done ? "✓ Feito" : "⏳ Pendente"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
