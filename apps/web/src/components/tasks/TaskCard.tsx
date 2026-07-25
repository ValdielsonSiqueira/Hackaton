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

  return (
    <article
      className={`task-card priority-${task.priority} ${task.done ? "done" : ""}`}
      role="listitem"
    >
      <div className="task-main">
        <label className="ibm-check-wrap" aria-label={`Marcar ${task.title} como concluída`}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleTask(task.id)}
          />
          <div className="ibm-check-box"></div>
        </label>
        <div className="task-body">
          <div className="task-title">{task.title}</div>
          <div className="task-meta">
            <span className="task-tag">{task.category}</span>
            <span className={`task-due ${task.urgent ? "urgent" : ""}`}>{task.due}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEditTask(task)}
            className="p-2 text-[#525252] hover:text-[#0f62fe] hover:bg-[#e5edff] cursor-pointer border-0 rounded-sm transition-colors"
            title="Editar atividade e passos"
            aria-label={`Editar atividade: ${task.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteTask(task)}
            className="p-2 text-[#525252] hover:text-[#da1e28] hover:bg-[#fff0f0] cursor-pointer border-0 rounded-sm transition-colors"
            title="Excluir atividade"
            aria-label={`Excluir atividade: ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {task.steps && task.steps.length > 0 && (
            <button
              type="button"
              className="expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5 text-[#525252]" /> : <ChevronDown className="w-5 h-5 text-[#525252]" />}
            </button>
          )}
        </div>
      </div>

      {task.steps && task.steps.length > 0 && isExpanded && (
        <div className="task-steps open" role="region">
          <div className="steps-title flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0f62fe]" /> Passo a passo com leitura por voz
          </div>
          {task.steps.map((s) => (
            <div key={s.id} className={`step-item ${s.done ? "done-step" : ""}`}>
              <div
                className="step-num"
                onClick={() => onToggleStep(task.id, s.id)}
                style={{ cursor: "pointer" }}
              >
                {s.id}
              </div>
              <p style={{ flex: 1 }}>{s.text}</p>
              <button
                type="button"
                className="btn-audio flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[var(--surface-1)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white transition-colors cursor-pointer border border-[var(--hairline)]"
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
