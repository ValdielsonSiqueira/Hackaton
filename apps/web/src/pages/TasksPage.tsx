import React, { useState } from "react";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { useApp } from "../context/AppContext";
import type { TaskItem, Step } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Plus, Sparkles, PartyPopper } from "lucide-react";

// Tasks Modular Sub-components
import { TasksHeader } from "../components/tasks/TasksHeader";
import { TasksProgress } from "../components/tasks/TasksProgress";
import { TaskFilterTabs } from "../components/tasks/TaskFilterTabs";
import { TaskCard } from "../components/tasks/TaskCard";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { DeleteTaskModal } from "../components/tasks/DeleteTaskModal";

export const TasksPage: React.FC = () => {
  const { activityTasks, setActivityTasks, deleteActivityTask } = useApp();

  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const handleToggleTask = (id: string) => {
    let wasCompleted = false;
    let taskTitle = "";

    setActivityTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.done;
          wasCompleted = nextState;
          taskTitle = t.title;
          return {
            ...t,
            done: nextState,
            steps: t.steps ? t.steps.map((s) => ({ ...s, done: nextState })) : undefined,
          };
        }
        return t;
      })
    );

    if (wasCompleted) {
      triggerToast(`🎉 Atividade "${taskTitle}" concluída com sucesso!`);
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 2200);
    } else {
      triggerToast(`Atividade marcada como pendente`);
    }
  };

  const handleToggleStep = (taskId: string, stepId: number) => {
    setActivityTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.steps) {
          const updatedSteps = t.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
          const allDone = updatedSteps.every((s) => s.done);
          return {
            ...t,
            done: allDone,
            steps: updatedSteps,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (taskData: {
    id?: string;
    title: string;
    category: string;
    priority: "low" | "medium" | "high";
    due: string;
    steps?: Step[];
  }) => {
    if (taskData.id) {
      setActivityTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                title: taskData.title,
                category: taskData.category,
                due: taskData.due,
                urgent: taskData.priority === "high",
                priority: taskData.priority,
                steps: taskData.steps,
              }
            : t
        )
      );
      triggerToast(`Atividade "${taskData.title}" atualizada com sucesso!`);
    } else {
      const newTask: TaskItem = {
        id: String(Date.now()),
        title: taskData.title,
        category: taskData.category,
        due: taskData.due,
        urgent: taskData.priority === "high",
        done: false,
        priority: taskData.priority,
        steps: taskData.steps,
      };
      setActivityTasks((prev) => [newTask, ...prev]);
      triggerToast("Atividade cadastrada com sucesso!");
    }
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const title = taskToDelete.title;
    deleteActivityTask(taskToDelete.id);
    setTaskToDelete(null);
    triggerToast(`Atividade "${title}" excluída com sucesso`);
  };

  const completedCount = activityTasks.filter((t) => t.done).length;
  const totalCount = activityTasks.length;
  const pendingCount = totalCount - completedCount;

  const filteredTasks = activityTasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main className="main-content" role="main" style={{ flex: 1 }}>
        <TasksHeader
          onOpenCreateModal={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
        />

        <TasksProgress
          completedCount={completedCount}
          totalCount={totalCount}
        />

        <TaskFilterTabs
          filter={filter}
          onFilterChange={setFilter}
          totalCount={totalCount}
          pendingCount={pendingCount}
          doneCount={completedCount}
        />

        {/* Modal / Form for Creating or Editing Task */}
        <CreateTaskModal
          editingTask={editingTask}
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSaveTask={handleSaveTask}
          onTriggerToast={triggerToast}
        />

        {/* Task Cards List */}
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
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTask(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Cadastrar Primeira Atividade
              </Button>
            )}
          </Card>
        ) : (
          <div className="task-list" id="task-list" role="list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleTask={handleToggleTask}
                onToggleStep={handleToggleStep}
                onEditTask={(t) => {
                  setEditingTask(t);
                  setFormOpen(true);
                }}
                onDeleteTask={setTaskToDelete}
                onTriggerToast={triggerToast}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal for Task Deletion */}
      <DeleteTaskModal
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onClose={() => setTaskToDelete(null)}
      />

      {/* Celebration Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in pointer-events-none">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 transform animate-bounce-short">
            <div className="w-16 h-16 bg-[#24a148]/10 text-[#24a148] rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#161616] mb-2">Excelente trabalho!</h3>
            <p className="text-sm text-[#525252]">
              Você concluiu mais uma atividade acadêmica do seu dia.
            </p>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
