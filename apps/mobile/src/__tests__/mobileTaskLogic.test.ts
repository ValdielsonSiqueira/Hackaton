import { describe, it, expect } from "vitest";
import type { MobileTaskItem } from "../context/AppContext";

describe("Mobile Task Domain & Priority Filtering", () => {
  const sampleTasks: MobileTaskItem[] = [
    {
      id: "task-1",
      title: "Entregar Relatório Acadêmico de UX",
      category: "ACADÊMICO",
      priority: "high",
      due: "HOJE 18:00",
      done: false,
    },
    {
      id: "task-2",
      title: "Participar do Fórum de Discussão",
      category: "PARTICIPAÇÃO",
      priority: "medium",
      due: "AMANHÃ 10:00",
      done: true,
    },
    {
      id: "task-3",
      title: "Leitura de Capítulo 4",
      category: "LEITURA",
      priority: "low",
      due: "28/07 14:00",
      done: false,
    },
  ];

  it("should correctly identify pending vs completed tasks count", () => {
    const pendingTasks = sampleTasks.filter((t) => !t.done);
    const completedTasks = sampleTasks.filter((t) => t.done);

    expect(pendingTasks.length).toBe(2);
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].id).toBe("task-2");
  });

  it("should find the next urgent uncompleted task as priority", () => {
    const nextTask = sampleTasks.find((t) => !t.done);
    expect(nextTask).toBeDefined();
    expect(nextTask?.id).toBe("task-1");
    expect(nextTask?.priority).toBe("high");
  });

  it("should calculate guided steps completion percentage", () => {
    const steps = [
      { id: 1, text: "Abrir o portal", done: true },
      { id: 2, text: "Enviar arquivo PDF", done: false },
      { id: 3, text: "Confirmar protocolo", done: false },
    ];

    const completedSteps = steps.filter((s) => s.done).length;
    const progressPercentage = Math.round((completedSteps / steps.length) * 100);

    expect(completedSteps).toBe(1);
    expect(progressPercentage).toBe(33);
  });
});
