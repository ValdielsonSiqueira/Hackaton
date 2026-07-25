import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DateTimePicker } from "../ui/date-time-picker";
import { Mic, Sparkles, Trash2 } from "lucide-react";
import { taskSchema } from "../../schemas/forms";
import type { TaskItem, Step } from "../../context/AppContext";
import { voiceService } from "../../services/voiceService";

interface CreateTaskModalProps {
  editingTask: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: {
    id?: string;
    title: string;
    category: string;
    priority: "low" | "medium" | "high";
    due: string;
    steps?: Step[];
  }) => void;
  onTriggerToast: (msg: string) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  editingTask,
  isOpen,
  onClose,
  onSaveTask,
  onTriggerToast,
}) => {
  if (!isOpen) return null;

  const [newTaskName, setNewTaskName] = useState(editingTask ? editingTask.title : "");
  const [newTaskCategory, setNewTaskCategory] = useState(
    editingTask ? editingTask.category : "Acadêmico"
  );
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">(
    editingTask ? editingTask.priority : "medium"
  );
  const [newTaskDuePreset, setNewTaskDuePreset] = useState(
    editingTask ? editingTask.due : "HOJE 18:00"
  );
  const [stepInputs, setStepInputs] = useState<string[]>(
    editingTask && editingTask.steps && editingTask.steps.length > 0
      ? editingTask.steps.map((s) => s.text)
      : [""]
  );

  const [taskNameErrorMsg, setTaskNameErrorMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleStartDictation = () => {
    if (!voiceService.isSupported()) {
      onTriggerToast("Reconhecimento de voz não suportado neste navegador");
      return;
    }

    setIsListening(true);
    onTriggerToast("🎙️ Ouvindo... Fale o nome da atividade");

    voiceService.startListening({
      onResult: (transcript) => {
        setNewTaskName(transcript);
        setTaskNameErrorMsg(null);
        setIsListening(false);
        onTriggerToast(`Atividade ditada: "${transcript}"`);
      },
      onError: () => {
        setIsListening(false);
        onTriggerToast("Não foi possível ouvir. Tente digitar.");
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleAddStepInput = () => {
    setStepInputs([...stepInputs, ""]);
  };

  const handleStepInputChange = (index: number, val: string) => {
    const updated = [...stepInputs];
    updated[index] = val;
    setStepInputs(updated);
  };

  const handleRemoveStepInput = (index: number) => {
    setStepInputs(stepInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTaskNameErrorMsg(null);

    const result = taskSchema.safeParse({
      title: newTaskName,
      category: newTaskCategory,
      priority: newTaskPriority,
      duePreset: newTaskDuePreset,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors.title?.[0]) {
        setTaskNameErrorMsg(fieldErrors.title[0]);
        onTriggerToast(`⚠️ ${fieldErrors.title[0]}`);
      }
      return;
    }

    const formattedSteps: Step[] = stepInputs
      .filter((s) => s.trim().length > 0)
      .map((text, idx) => {
        const existingDone = editingTask?.steps?.find((existing) => existing.text === text.trim())?.done || false;
        return {
          id: idx + 1,
          text: text.trim(),
          done: existingDone,
        };
      });

    onSaveTask({
      id: editingTask?.id,
      title: result.data.title,
      category: newTaskCategory.toUpperCase(),
      priority: newTaskPriority,
      due: newTaskDuePreset,
      steps: formattedSteps.length > 0 ? formattedSteps : undefined,
    });

    onClose();
  };

  return (
    <Card className="bg-[var(--canvas)] border border-[var(--hairline)] border-l-4 border-l-[var(--primary)] p-6 sm:p-8 mb-6 rounded-xl shadow-sm" id="new-task-form" role="region" aria-labelledby="form-heading">
      <div className="flex items-center justify-between mb-4">
        <h3 id="form-heading" className="text-2xl font-normal text-[#161616]">
          {editingTask ? "Editar Atividade e Passos" : "Cadastrar Nova Atividade"}
        </h3>
        <span className="text-xs uppercase tracking-wider text-[#0f62fe] font-semibold bg-[#e5edff] px-3 py-1">
          {editingTask ? "Modo Edição" : "Formulário Assistido"}
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Task Title + Voice Dictation */}
        <div className="relative mb-5" id="fg-task-name">
          <label htmlFor="new-task-name" className="flex items-center justify-between gap-2 mb-2 w-full">
            <span className="text-sm font-semibold text-[var(--ink)]">1. Nome da Atividade</span>
            <span className="text-xs text-[var(--ink-muted)] font-normal">Digite ou use o microfone</span>
          </label>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              id="new-task-name"
              value={newTaskName}
              onChange={(e) => {
                setNewTaskName(e.target.value);
                if (taskNameErrorMsg) setTaskNameErrorMsg(null);
              }}
              placeholder="Ex: Ler capítulo 5 de UX Design"
              autoComplete="off"
              className={`flex-1 bg-[var(--surface-1)] border-0 border-b ${
                taskNameErrorMsg 
                  ? "border-b-2 border-[var(--error)] focus:outline-[var(--error)] text-[var(--ink)]" 
                  : "border-[var(--ink-subtle)] focus:border-b-2 focus:border-[var(--primary)] text-[var(--ink)]"
              } h-12 px-4 rounded-none transition-colors`}
              required
              aria-required="true"
              aria-invalid={Boolean(taskNameErrorMsg)}
              aria-describedby={taskNameErrorMsg ? "task-name-error-msg" : undefined}
            />
            <Button
              type="button"
              variant="primary"
              size="icon"
              onClick={handleStartDictation}
              className={isListening ? "bg-[#da1e28] text-white border-[#da1e28]" : "bg-[var(--primary)] text-white"}
              title="Ditar nome da atividade por voz"
              aria-label="Ditar por voz"
            >
              <Mic className="w-6 h-6 text-white shrink-0" />
            </Button>
          </div>
          {!taskNameErrorMsg && <p className="mt-1 text-xs text-[var(--ink-muted)]">Escreva um nome simples e claro para a tarefa</p>}
          {taskNameErrorMsg && (
            <p className="mt-1 text-xs text-[var(--error)] font-medium" id="task-name-error-msg" role="alert">
              {taskNameErrorMsg}
            </p>
          )}
        </div>

        {/* Row 2: Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label htmlFor="new-task-cat" className="block text-sm font-semibold text-[var(--ink)] mb-2">2. Categoria</label>
            <select
              id="new-task-cat"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="h-12 w-full bg-[var(--surface-1)] border-0 border-b border-[var(--ink-subtle)] focus:border-b-2 focus:border-[var(--primary)] px-4 text-base text-[var(--ink)] outline-none"
            >
              <option value="Acadêmico">Acadêmico</option>
              <option value="Aula online">Aula online</option>
              <option value="Leitura">Leitura</option>
              <option value="Participação">Participação</option>
              <option value="Exercício">Exercício</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">3. Nível de Prioridade</label>
            <div className="flex gap-2.5 min-h-[48px] items-center">
              <button
                type="button"
                onClick={() => setNewTaskPriority("low")}
                className={`flex-1 h-12 rounded-lg font-bold text-sm sm:text-base border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newTaskPriority === "low" 
                    ? "bg-[#24a148] text-white border-2 border-[#24a148] shadow-md" 
                    : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
                }`}
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${newTaskPriority === "low" ? "bg-white" : "bg-[#24a148]"}`} aria-hidden="true" />
                Baixa
              </button>
              <button
                type="button"
                onClick={() => setNewTaskPriority("medium")}
                className={`flex-1 h-12 rounded-lg font-bold text-sm sm:text-base border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newTaskPriority === "medium" 
                    ? "bg-[#f1c21b] text-[#161616] border-2 border-[#f1c21b] shadow-md" 
                    : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
                }`}
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${newTaskPriority === "medium" ? "bg-[#161616]" : "bg-[#f1c21b]"}`} aria-hidden="true" />
                Média
              </button>
              <button
                type="button"
                onClick={() => setNewTaskPriority("high")}
                className={`flex-1 h-12 rounded-lg font-bold text-sm sm:text-base border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  newTaskPriority === "high" 
                    ? "bg-[#da1e28] text-white border-2 border-[#da1e28] shadow-md" 
                    : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
                }`}
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${newTaskPriority === "high" ? "bg-white" : "bg-[#da1e28]"}`} aria-hidden="true" />
                Urgente
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Accessible Date & Time Calendar Picker */}
        <div className="field-group mb-6">
          <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
            4. Horário e Lembrete
          </label>
          <DateTimePicker
            value={newTaskDuePreset}
            onChange={setNewTaskDuePreset}
          />
        </div>

        {/* Row 4: Step-by-Step Guided Creator */}
        <div className="field-group mb-6 border-t border-[#e0e0e0] pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#0f62fe]" /> 5. Passos Guiados (Opcional)
            </label>
            <Button
              type="button"
              variant="tertiary"
              onClick={handleAddStepInput}
              className="h-9 min-h-[36px] text-xs px-3"
            >
              + Adicionar Passo
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {stepInputs.map((stepText, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#0f62fe] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {idx + 1}
                </span>
                <Input
                  type="text"
                  value={stepText}
                  onChange={(e) => handleStepInputChange(idx, e.target.value)}
                  placeholder={`Ex: Passo ${idx + 1} — Abrir o portal...`}
                  className="flex-1 h-[48px] min-h-[48px]"
                />
                {stepInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStepInput(idx)}
                    className="p-2 text-[#da1e28] hover:bg-[#fff0f0] cursor-pointer border-0"
                    title="Remover passo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions flex gap-3">
          <Button type="submit" variant="primary" id="save-task-btn" className="flex-1">
            {editingTask ? "Atualizar Atividade" : "Salvar Atividade"}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            id="cancel-task-btn"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
