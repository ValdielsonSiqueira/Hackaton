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
    if (cat.includes("AULA") || cat.includes("ONLINE")) return <Video className="w-5 h-5 text-[#0f62fe]" />;
    if (cat.includes("LEITURA")) return <BookOpen className="w-5 h-5 text-[#0f62fe]" />;
    if (cat.includes("PARTICIPAÇ") || cat.includes("FÓRUM")) return <MessageSquare className="w-5 h-5 text-[#24a148]" />;
    return <FileCheck className="w-5 h-5 text-[#161616]" />;
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
    <div id="recent-activity-section" className="recent-activity mt-8 sm:mt-10 p-3 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-xl">
      <div className="section-header flex items-center justify-between flex-wrap gap-2">
        <h2>Minhas Atividades Recentes ({tasks.length})</h2>
        <Link to="/tarefas">
          <Button variant="tertiary" size="sm" className="text-xs h-9 px-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#0f62fe]" /> Adicionar / Ver Todas
          </Button>
        </Link>
      </div>

      <Card id="recent-activity-card" className="task-card-list p-2 sm:p-4 mt-3 mb-0">
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
              className={`task-card-row flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-1)] transition-colors gap-3 ${
                t.done ? "opacity-70 bg-black/5" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleSpeakTask(t)}
                  className="w-8 h-8 rounded-full bg-white border border-[var(--hairline)] hover:bg-[#e5edff] hover:text-[#0f62fe] flex items-center justify-center shrink-0 text-[var(--ink)] cursor-pointer transition-colors"
                  aria-label={`Ouvir detalhes da atividade ${t.title}`}
                  title="Ouvir atividade"
                >
                  <Volume2 className="w-4 h-4 text-[var(--primary)]" />
                </button>
                <div className="p-2 rounded bg-[var(--canvas)] border border-[var(--hairline)] shrink-0">
                  {getActivityIcon(t.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="title truncate text-sm sm:text-base font-medium text-[var(--ink)]">{t.title}</div>
                  <div className="time text-xs text-[var(--ink-muted)]">{t.done ? `Concluído (${t.due})` : `Até ${t.due}`}</div>
                </div>
              </div>
              <Badge variant={t.done ? "success" : "pending"} className="text-xs px-3 py-1 shrink-0">
                {t.done ? "✓ Feito" : "⏳ Pendente"}
              </Badge>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
