import React, { useState } from "react";
import { TopNav } from "../components/layout/TopNav";
import { useApp } from "../context/AppContext";
import type { TaskItem, Step } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Plus, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Sparkles,
  PartyPopper,
  X,
  Mic,
  Clock,
  CheckCircle2,
  Trash2,
  Compass
} from "lucide-react";
import { taskSchema } from "../schemas/forms";
import { startTasksTour } from "../utils/tour";

export const TasksPage: React.FC = () => {
  const { 
    activityTasks, 
    setActivityTasks, 
    toggleActivityTask, 
    toggleActivityStep, 
    deleteActivityTask 
  } = useApp();

  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [expandedTask, setExpandedTask] = useState<string | null>("1");

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [taskNameErrorMsg, setTaskNameErrorMsg] = useState<string | null>(null);
  const [newTaskCategory, setNewTaskCategory] = useState("ACADÊMICO");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newTaskDuePreset, setNewTaskDuePreset] = useState("HOJE 18:00");
  const [stepInputs, setStepInputs] = useState<string[]>([""]);
  const [isListening, setIsListening] = useState(false);

  const [successOverlay, setSuccessOverlay] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessOverlay(msg);
    setTimeout(() => setSuccessOverlay(null), 2500);
  };

  const handleToggleTask = (id: string) => {
    const target = activityTasks.find((t) => t.id === id);
    if (target) {
      if (!target.done) {
        triggerSuccess("Parabéns! Atividade concluída com sucesso!");
      } else {
        triggerToast("Atividade marcada como pendente");
      }
    }
    toggleActivityTask(id);
  };

  const handleToggleStep = (taskId: string, stepId: number) => {
    toggleActivityStep(taskId, stepId);
  };

  const handleDeleteTask = (id: string) => {
    deleteActivityTask(id);
    triggerToast("Atividade removida");
  };

  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      triggerToast("🔊 Lendo em voz alta...");
    } else {
      triggerToast("Seu navegador não suporta leitura em voz alta");
    }
  };

  const handleStartDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        setIsListening(true);
        triggerToast("🎙️ Ouvindo... Fale o nome da atividade");

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setNewTaskName(transcript);
          setTaskNameErrorMsg(null);
          setIsListening(false);
          triggerToast(`Atividade ditada: "${transcript}"`);
        };

        recognition.onerror = () => {
          setIsListening(false);
          triggerToast("Não foi possível ouvir. Tente digitar.");
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
        triggerToast("Reconhecimento de voz não suportado neste navegador");
      }
    } else {
      triggerToast("Reconhecimento de voz não suportado neste navegador");
    }
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

  const handleSaveTask = () => {
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
        triggerToast(`⚠️ ${fieldErrors.title[0]}`);
      }
      return;
    }

    const formattedSteps: Step[] = stepInputs
      .filter((s) => s.trim().length > 0)
      .map((text, idx) => ({
        id: idx + 1,
        text: text.trim(),
        done: false,
      }));

    const newTask: TaskItem = {
      id: String(Date.now()),
      title: result.data.title,
      category: newTaskCategory.toUpperCase(),
      due: newTaskDuePreset,
      urgent: newTaskPriority === "high",
      done: false,
      priority: newTaskPriority,
      steps: formattedSteps.length > 0 ? formattedSteps : undefined,
    };

    setActivityTasks((prev) => [newTask, ...prev]);
    setNewTaskName("");
    setStepInputs([""]);
    setFormOpen(false);
    triggerToast("Atividade cadastrada com sucesso!");
  };

  const completedCount = activityTasks.filter((t) => t.done).length;
  const totalCount = activityTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = activityTasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main className="main-content" role="main">
        {/* Page Header */}
        <div className="page-header flex items-center justify-between flex-wrap gap-3">
          <h2>Suas atividades de hoje</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              onClick={() => startTasksTour()}
              className="flex items-center gap-2 text-sm h-10 min-h-[40px] px-3 border-[var(--hairline)] text-[var(--ink)] hover:bg-[var(--surface-1)]"
              title="Ver Tour Guiado das Atividades"
              aria-label="Ver Tour Guiado das Atividades"
            >
              <Compass className="w-4 h-4 text-[var(--primary)]" /> Tour Guiado
            </Button>
            <Button
              variant="primary"
              id="btn-new-task"
              onClick={() => setFormOpen(!formOpen)}
              aria-expanded={formOpen}
              className="flex items-center gap-2"
            >
              {formOpen ? <><X className="w-5 h-5" /> Fechar formulário</> : <><Plus className="w-5 h-5" /> Adicionar atividade</>}
            </Button>
          </div>
        </div>

        {/* New Task Form Enhanced */}
        {formOpen && (
          <Card className="new-task-form open mb-6 border-l-4 border-l-[#0f62fe]" id="new-task-form" role="region" aria-labelledby="form-heading">
            <div className="flex items-center justify-between mb-4">
              <h3 id="form-heading" className="text-2xl font-normal text-[#161616]">Cadastrar Nova Atividade</h3>
              <span className="text-xs uppercase tracking-wider text-[#0f62fe] font-semibold bg-[#e5edff] px-3 py-1">
                Formulário Assistido
              </span>
            </div>

            {/* Task Title + Voice Dictation */}
            <div className={`form-group ${taskNameErrorMsg ? "error" : ""}`} id="fg-task-name">
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
                  className="flex-1"
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
              {!taskNameErrorMsg && <p className="form-helper">Escreva um nome simples e claro para a tarefa</p>}
              {taskNameErrorMsg && (
                <p className="form-error-msg" id="task-name-error-msg" role="alert">
                  {taskNameErrorMsg}
                </p>
              )}
            </div>

            {/* Row 2: Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="field-group">
                <label htmlFor="new-task-cat">2. Categoria</label>
                <select
                  id="new-task-cat"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="h-[56px] w-full bg-[#f4f4f4] border-b-2 border-[#8c8c8c] px-4 font-sans text-base text-[#161616]"
                >
                  <option value="Acadêmico">Acadêmico</option>
                  <option value="Aula online">Aula online</option>
                  <option value="Leitura">Leitura</option>
                  <option value="Participação">Participação</option>
                  <option value="Exercício">Exercício</option>
                </select>
              </div>

              <div className="field-group">
                <label>3. Nível de Prioridade</label>
                <div className="flex gap-2 h-[56px] items-center">
                  <button
                    type="button"
                    onClick={() => setNewTaskPriority("low")}
                    className={`flex-1 h-full font-medium text-sm border cursor-pointer transition-colors ${newTaskPriority === "low" ? "bg-[#24a148] text-white border-[#24a148]" : "bg-[#f4f4f4] text-[#161616] border-[#e0e0e0]"}`}
                  >
                    🟢 Baixa
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTaskPriority("medium")}
                    className={`flex-1 h-full font-medium text-sm border cursor-pointer transition-colors ${newTaskPriority === "medium" ? "bg-[#f1c21b] text-[#161616] border-[#f1c21b]" : "bg-[#f4f4f4] text-[#161616] border-[#e0e0e0]"}`}
                  >
                    🟡 Média
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTaskPriority("high")}
                    className={`flex-1 h-full font-medium text-sm border cursor-pointer transition-colors ${newTaskPriority === "high" ? "bg-[#da1e28] text-white border-[#da1e28]" : "bg-[#f4f4f4] text-[#161616] border-[#e0e0e0]"}`}
                  >
                    🔴 Urgente
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Preset Time Selection */}
            <div className="field-group mb-6">
              <label className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#0f62fe]" /> 4. Horário e Lembrete
              </label>
              <div className="flex gap-2 flex-wrap">
                {["HOJE 18:00", "HOJE 20:00", "AMANHÃ 09:00", "AMANHÃ 14:00"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewTaskDuePreset(preset)}
                    className={`px-4 py-2 text-sm border cursor-pointer ${newTaskDuePreset === preset ? "bg-[#0f62fe] text-white border-[#0f62fe]" : "bg-[#f4f4f4] text-[#161616] border-[#e0e0e0]"}`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
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
              <Button variant="primary" id="save-task-btn" onClick={handleSaveTask} className="flex-1">
                <CheckCircle2 className="w-5 h-5 ml-1" /> Confirmar e Salvar Atividade
              </Button>
              <Button variant="tertiary" id="cancel-form-btn" onClick={() => setFormOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Progress Section */}
        <Card className="progress-section mb-6" role="status" aria-label={`${completedCount} de ${totalCount} atividades concluídas`}>
          <div className="prog-num" aria-hidden="true">
            {completedCount}/{totalCount}
          </div>
          <div className="prog-text w-full">
            <div className="label">
              Progresso do dia — {completedCount} de {totalCount} atividades concluídas
            </div>
            <Progress value={progressPct} />
            <div className="prog-pct">{progressPct}% concluído</div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <Tabs className="mb-6">
          <TabsList>
            <TabsTrigger active={filter === "all"} onClick={() => setFilter("all")}>
              Todas ({activityTasks.length})
            </TabsTrigger>
            <TabsTrigger active={filter === "pending"} onClick={() => setFilter("pending")}>
              Pendentes ({activityTasks.filter((t) => !t.done).length})
            </TabsTrigger>
            <TabsTrigger active={filter === "done"} onClick={() => setFilter("done")}>
              Concluídas ({activityTasks.filter((t) => t.done).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Card className="empty-state p-10 text-center bg-[var(--canvas)] border border-[var(--hairline)] my-4 flex flex-col items-center justify-center">
            <Sparkles className="w-12 h-12 text-[#0f62fe] mb-3 opacity-60" aria-hidden="true" />
            <h4 className="text-xl font-normal text-[#161616] mb-1">Nenhuma atividade encontrada</h4>
            <p className="text-sm text-[#525252] mb-4 max-w-[440px]">
              {filter === "pending"
                ? "Você não possui atividades pendentes no momento. Parabéns!"
                : filter === "done"
                ? "Nenhuma atividade foi concluída ainda hoje."
                : "Sua lista de atividades está vazia. Clique abaixo para cadastrar a primeira."}
            </p>
            {filter === "all" && (
              <Button variant="primary" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Cadastrar Primeira Atividade
              </Button>
            )}
          </Card>
        ) : (
          <div className="task-list" id="task-list" role="list">
            {filteredTasks.map((t) => (
              <article
                key={t.id}
                className={`task-card priority-${t.priority} ${t.done ? "done" : ""}`}
                role="listitem"
              >
                <div className="task-main">
                  <label className="ibm-check-wrap" aria-label={`Marcar ${t.title} como concluída`}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => handleToggleTask(t.id)}
                    />
                    <div className="ibm-check-box"></div>
                  </label>
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      <span className="task-tag">{t.category}</span>
                      <span className={`task-due ${t.urgent ? "urgent" : ""}`}>{t.due}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-2 text-[#525252] hover:text-[#da1e28] hover:bg-[#fff0f0] cursor-pointer border-0 rounded-sm transition-colors"
                      title="Excluir atividade"
                      aria-label={`Excluir atividade: ${t.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {t.steps && t.steps.length > 0 && (
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)}
                        aria-expanded={expandedTask === t.id}
                      >
                        {expandedTask === t.id ? <ChevronUp className="w-5 h-5 text-[#525252]" /> : <ChevronDown className="w-5 h-5 text-[#525252]" />}
                      </button>
                    )}
                  </div>
                </div>

                {t.steps && t.steps.length > 0 && expandedTask === t.id && (
                  <div className="task-steps open" role="region">
                    <div className="steps-title flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0f62fe]" /> Passo a passo com leitura por voz
                    </div>
                    {t.steps.map((s) => (
                      <div key={s.id} className={`step-item ${s.done ? "done-step" : ""}`}>
                        <div
                          className="step-num"
                          onClick={() => handleToggleStep(t.id, s.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {s.id}
                        </div>
                        <p style={{ flex: 1 }}>{s.text}</p>
                        <button
                          type="button"
                          className="btn-audio flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[var(--surface-1)] hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white transition-colors cursor-pointer border border-[var(--hairline)]"
                          onClick={() => handleSpeakText(s.text)}
                          title="Ouvir instrução"
                          aria-label={`Ouvir instrução: ${s.text}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div className="step-actions flex gap-2 mt-4">
                      <Button
                        variant="primary"
                        onClick={() => handleSpeakText(`Atividade: ${t.title}. Passos: ${t.steps?.map((s) => s.text).join(". ")}`)}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-5 h-5" /> Ouvir tudo em voz alta
                      </Button>
                      <Button
                        variant="tertiary"
                        onClick={() => triggerToast("⏰ Lembrete definido com sucesso")}
                        className="flex items-center gap-2"
                      >
                        <Bell className="w-5 h-5" /> Definir lembrete
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Success Overlay */}
      {successOverlay && (
        <div className="success-overlay active" role="alert" aria-live="assertive">
          <div className="success-box">
            <PartyPopper className="w-16 h-16 text-[#24a148] mx-auto mb-4" aria-hidden="true" />
            <h3>Muito bem!</h3>
            <p>{successOverlay}</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
