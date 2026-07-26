import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../useAppStore";
import type { TaskItem } from "../../context/AppContext";

describe("useAppStore (Zustand)", () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      settings: {
        contrastMode: "standard",
        fontScale: 1.0,
        fontSizeScale: "medium",
        spacingScale: "standard",
        navigationMode: "standard",
        feedbackVisual: true,
        criticalConfirmation: true,
      },
      tasks: [],
      userProfile: { name: "", email: "", caregiverContact: "", isAuthenticated: false },
      activityTasks: [],
      loading: false,
    });
  });

  it("should update user profile state and persist", async () => {
    const store = useAppStore.getState();
    await store.updateUserProfile({ name: "Carlos Oliveira", email: "carlos@fiap.com", isAuthenticated: true });

    const updatedState = useAppStore.getState();
    expect(updatedState.userProfile.name).toBe("Carlos Oliveira");
    expect(updatedState.userProfile.email).toBe("carlos@fiap.com");
    expect(updatedState.userProfile.isAuthenticated).toBe(true);
  });

  it("should update font scale and theme contrast mode", async () => {
    const store = useAppStore.getState();
    await store.updateSettings({ ...store.settings, fontScale: 1.5, contrastMode: "dark" });

    const updatedState = useAppStore.getState();
    expect(updatedState.settings.fontScale).toBe(1.5);
    expect(updatedState.settings.contrastMode).toBe("dark");
  });

  it("should add, toggle, and delete activity tasks", async () => {
    const store = useAppStore.getState();
    const newTask: TaskItem = {
      id: "activity-100",
      title: "Participar do Fórum de IA",
      category: "ACADÊMICO",
      due: "HOJE 20:00",
      done: false,
      priority: "medium",
    };

    await store.addActivityTask(newTask);
    expect(useAppStore.getState().activityTasks).toHaveLength(1);

    await store.toggleActivityTask("activity-100");
    expect(useAppStore.getState().activityTasks[0].done).toBe(true);

    await store.deleteActivityTask("activity-100");
    expect(useAppStore.getState().activityTasks).toHaveLength(0);
  });
});
