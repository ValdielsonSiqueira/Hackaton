import React, { useState } from "react";
import { Button } from "../ui/button";
import { 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Volume2, 
  Bell 
} from "lucide-react";
import type { TaskItem } from "../../context/AppContext";
import { speakText } from "../../services/speech";

interface TaskCardProps {
  task: TaskItem;
  onToggleTask: (id: string) => void;
  onToggleStep: (taskId: string, stepId: number) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onTriggerToast: (msg: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleTask,
  onToggleStep,
  onEditTask,
  onDeleteTask,
  onTriggerToast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSpeakInstruction = (text: string) => {
    const success = speakText(text);
    if (success) {
      onTriggerToast("🔊 Lendo instrução em voz alta...");
    } else {
      onTriggerToast("Navegador não suporta voz nativa");
    }
  };

  const getPriorityBorder = () => {
    if (task.done) return "border-l-[var(--success)]";
    if (task.priority === "high") return "border-l-[var(--error)]";
    if (task.priority === "medium") return "border-l-[var(--warning)]";
    return "border-l-[var(--success)]";
  };

  return (
    <article
      className={`bg-[var(--canvas)] border-l-4 ${getPriorityBorder()} border-t border-r border-b border-[var(--hairline)] rounded-lg overflow-hidden transition-colors hover:bg-[var(--surface-1)] mb-2`}
      role="listitem"
    >
      <div className="flex items-center gap-4 p-5 sm:p-6">
        <label className="relative shrink-0 cursor-pointer" aria-label={`Marcar ${task.title} como concluída`}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleTask(task.id)}
            className="sr-only peer"
          />
          <div className="w-9 h-9 border-2 border-[var(--ink-subtle)] rounded flex items-center justify-center bg-[var(--canvas)] text-white text-lg font-bold transition-colors peer-checked:bg-[var(--success)] peer-checked:border-[var(--success)]">
            {task.done && "✓"}
          </div>
        </label>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-medium text-[var(--ink)] mb-1 leading-snug ${task.done ? "line-through text-[var(--ink-subtle)]" : ""}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 bg-[var(--surface-1)] border border-[var(--hairline)] text-[var(--ink-muted)] rounded">
              {task.category}
            </span>
            <span className={`text-xs ${task.urgent ? "text-[var(--error)] font-bold" : "text-[var(--ink-subtle)]"}`}>
              {task.due}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEditTask(task)}
            className="p-2 text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-1)] cursor-pointer border-0 rounded transition-colors"
            title="Editar atividade e passos"
            aria-label={`Editar atividade: ${task.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteTask(task)}
            className="p-2 text-[var(--ink-muted)] hover:text-[#da1e28] hover:bg-[#fff0f0] cursor-pointer border-0 rounded transition-colors"
            title="Excluir atividade"
            aria-label={`Excluir atividade: ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {task.steps && task.steps.length > 0 && (
            <button
              type="button"
              className="p-2 text-[var(--ink-muted)] hover:bg-[var(--surface-1)] rounded cursor-pointer border-0 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--ink-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--ink-muted)]" />}
            </button>
          )}
        </div>
      </div>

      {task.steps && task.steps.length > 0 && isExpanded && (
        <div className="p-5 sm:p-6 border-t border-[var(--hairline)] bg-[var(--surface-1)] space-y-3" role="region">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" /> Passo a passo com leitura por voz
          </div>
          {task.steps.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-[var(--canvas)] border border-[var(--hairline)] rounded">
              <button
                type="button"
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer border-0 ${s.done ? "bg-[var(--success)]" : "bg-[var(--primary)]"}`}
                onClick={() => onToggleStep(task.id, s.id)}
              >
                {s.id}
              </button>
              <p className={`text-sm text-[var(--ink-muted)] flex-1 m-0 ${s.done ? "line-through text-[var(--ink-subtle)]" : ""}`}>
                {s.text}
              </p>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[var(--surface-1)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer border border-[var(--hairline)]"
                onClick={() => handleSpeakInstruction(s.text)}
                title="Ouvir instrução"
                aria-label={`Ouvir instrução: ${s.text}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="mt-3 pt-3 border-t border-[var(--hairline)] flex justify-end">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => onTriggerToast(`Lembrete ativado para ${task.title}`)}
              className="text-xs flex items-center gap-1.5 h-8 border-[var(--hairline)]"
            >
              <Bell className="w-5 h-5" /> Definir lembrete
            </Button>
          </div>
        </div>
      )}
    </article>
  );
};
