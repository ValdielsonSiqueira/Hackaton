import { create } from "zustand";
import type { Task } from "@seniorease/core";
import type { TaskItem } from "../../../context/AppContext";
import { container } from "../../../shared/index";

interface TasksState {
  tasks: Task[];
  activityTasks: TaskItem[];
  loading: boolean;

  loadTasks: () => Promise<Task[]>;
  loadActivityTasks: () => Promise<TaskItem[]>;

  setActivityTasks: (tasks: TaskItem[]) => Promise<void>;
  addActivityTask: (task: TaskItem) => Promise<void>;
  updateActivityTask: (task: TaskItem) => Promise<void>;
  toggleActivityTask: (id: string) => Promise<void>;
  toggleActivityStep: (taskId: string, stepId: number) => Promise<void>;
  deleteActivityTask: (id: string) => Promise<void>;
  clearAllActivityTasks: () => Promise<void>;

  createTask: (title: string, description: string, instructions: string[]) => Promise<void>;
  toggleStep: (taskId: string, stepId: string) => Promise<Task | null>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  activityTasks: [],
  loading: true,

  loadTasks: async () => {
    try {
      const loaded = await container.manageTasksUseCase.listTasks();
      set({ tasks: loaded, loading: false });
      return loaded;
    } catch (err) {
      set({ loading: false });
      return get().tasks;
    }
  },

  loadActivityTasks: async () => {
    try {
      const loaded = await container.activityRepository.getActivities();
      set({ activityTasks: loaded, loading: false });
      return loaded;
    } catch (err) {
      set({ loading: false });
      return get().activityTasks;
    }
  },

  setActivityTasks: async (newActivities: TaskItem[]) => {
    await container.activityRepository.saveActivities(newActivities);
    set({ activityTasks: newActivities });
  },

  addActivityTask: async (task: TaskItem) => {
    const updated = [task, ...get().activityTasks];
    await container.activityRepository.saveActivities(updated);
    set({ activityTasks: updated });
  },

  updateActivityTask: async (updatedTask: TaskItem) => {
    const updated = get().activityTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    await container.activityRepository.saveActivities(updated);
    set({ activityTasks: updated });
  },

  toggleActivityTask: async (id: string) => {
    const updated = get().activityTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    await container.activityRepository.saveActivities(updated);
    set({ activityTasks: updated });
  },

  toggleActivityStep: async (taskId: string, stepId: number) => {
    const updated = get().activityTasks.map((task) => {
      if (task.id !== taskId) return task;
      const steps = (task.steps || []).map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
      const allDone = steps.length > 0 && steps.every((s) => s.done);
      return { ...task, steps, done: allDone };
    });
    await container.activityRepository.saveActivities(updated);
    set({ activityTasks: updated });
  },

  deleteActivityTask: async (id: string) => {
    const updated = get().activityTasks.filter((t) => t.id !== id);
    await container.activityRepository.saveActivities(updated);
    set({ activityTasks: updated });
  },

  clearAllActivityTasks: async () => {
    await container.activityRepository.saveActivities([]);
    set({ activityTasks: [] });
  },

  createTask: async (title: string, description: string, instructions: string[]) => {
    const newTask = await container.manageTasksUseCase.createTask(title, description, instructions);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  toggleStep: async (taskId: string, stepId: string) => {
    const updatedTask = await container.manageTasksUseCase.toggleStep(taskId, stepId);
    if (updatedTask) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
    return updatedTask;
  },

  toggleTask: async (taskId: string) => {
    const updatedTask = await container.manageTasksUseCase.toggleTaskCompletion(taskId);
    if (updatedTask) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
  },

  deleteTask: async (taskId: string) => {
    await container.manageTasksUseCase.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },
}));
