import { create } from "zustand";
import type { Task, UserSettings } from "@seniorease/core";
import { defaultSettings, ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  LocalStorageTaskRepository, 
  LocalStorageSettingsRepository 
} from "../data/LocalStorageRepositories";
import { 
  LocalStorageUserProfileRepository, 
  type UserProfile 
} from "../data/LocalStorageUserProfileRepository";
import { 
  LocalStorageActivityRepository 
} from "../data/LocalStorageActivityRepository";
import type { TaskItem } from "../context/AppContext";

const taskRepo = new LocalStorageTaskRepository();
const settingsRepo = new LocalStorageSettingsRepository();
const userProfileRepo = new LocalStorageUserProfileRepository();
const activityRepo = new LocalStorageActivityRepository();

const taskUseCase = new ManageTasks(taskRepo);
const settingsUseCase = new ManageSettings(settingsRepo);

interface AppState {
  settings: UserSettings;
  tasks: Task[];
  userProfile: UserProfile;
  activityTasks: TaskItem[];
  loading: boolean;

  // Actions
  initializeStore: () => Promise<void>;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  
  // Activity Tasks Actions
  setActivityTasks: (tasks: TaskItem[]) => Promise<void>;
  addActivityTask: (task: TaskItem) => Promise<void>;
  updateActivityTask: (task: TaskItem) => Promise<void>;
  toggleActivityTask: (id: string) => Promise<void>;
  toggleActivityStep: (taskId: string, stepId: number) => Promise<void>;
  deleteActivityTask: (id: string) => Promise<void>;
  clearAllActivityTasks: () => Promise<void>;

  // Core Tasks Actions
  createTask: (title: string, description: string, instructions: string[]) => Promise<void>;
  toggleStep: (taskId: string, stepId: string) => Promise<Task | null>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: defaultSettings,
  tasks: [],
  userProfile: { name: "", email: "", caregiverContact: "", isAuthenticated: false },
  activityTasks: [],
  loading: true,

  initializeStore: async () => {
    try {
      const [loadedSettings, loadedTasks, loadedProfile, loadedActivities] = await Promise.all([
        settingsUseCase.loadSettings(),
        taskUseCase.listTasks(),
        userProfileRepo.getUserProfile(),
        activityRepo.getActivities(),
      ]);

      set({
        settings: loadedSettings,
        tasks: loadedTasks,
        userProfile: loadedProfile,
        activityTasks: loadedActivities,
        loading: false,
      });

      // Apply initial DOM variables
      get().updateSettings(loadedSettings);
    } catch (err) {
      console.error("Failed to initialize Zustand AppStore", err);
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings: UserSettings) => {
    await settingsUseCase.updateSettings(newSettings);
    set({ settings: newSettings });

    // Sync CSS Variables & Document Classes
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      const scale = newSettings.fontScale || (newSettings.fontSizeScale === "large" ? 1.5 : newSettings.fontSizeScale === "medium" ? 1.25 : 1.0);
      root.style.setProperty("--font-scale", scale.toString());
      root.style.setProperty("--text-scale", scale.toString());

      let spaceScale = 1.0;
      if (newSettings.spacingScale === "large") spaceScale = 1.25;
      root.style.setProperty("--spacing-scale", spaceScale.toString());

      if (newSettings.contrastMode === "high") {
        root.classList.add("high-contrast");
        root.classList.remove("dark-contrast");
      } else if (newSettings.contrastMode === "dark") {
        root.classList.add("dark-contrast");
        root.classList.remove("high-contrast");
      } else {
        root.classList.remove("high-contrast", "dark-contrast");
      }

      if (newSettings.navigationMode === "simplified") {
        root.classList.add("simplified-mode");
      } else {
        root.classList.remove("simplified-mode");
      }
    }
  },

  updateUserProfile: async (partial: Partial<UserProfile>) => {
    const updated = { ...get().userProfile, ...partial };
    await userProfileRepo.saveUserProfile(updated);
    set({ userProfile: updated });
  },

  setActivityTasks: async (newActivities: TaskItem[]) => {
    await activityRepo.saveActivities(newActivities);
    set({ activityTasks: newActivities });
  },

  addActivityTask: async (task: TaskItem) => {
    const updated = [task, ...get().activityTasks];
    await activityRepo.saveActivities(updated);
    set({ activityTasks: updated });
  },

  updateActivityTask: async (updatedTask: TaskItem) => {
    const updated = get().activityTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    await activityRepo.saveActivities(updated);
    set({ activityTasks: updated });
  },

  toggleActivityTask: async (id: string) => {
    const updated = get().activityTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    await activityRepo.saveActivities(updated);
    set({ activityTasks: updated });
  },

  toggleActivityStep: async (taskId: string, stepId: number) => {
    const updated = get().activityTasks.map((task) => {
      if (task.id !== taskId) return task;
      const steps = (task.steps || []).map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
      const allDone = steps.length > 0 && steps.every((s) => s.done);
      return { ...task, steps, done: allDone };
    });
    await activityRepo.saveActivities(updated);
    set({ activityTasks: updated });
  },

  deleteActivityTask: async (id: string) => {
    const updated = get().activityTasks.filter((t) => t.id !== id);
    await activityRepo.saveActivities(updated);
    set({ activityTasks: updated });
  },

  clearAllActivityTasks: async () => {
    await activityRepo.saveActivities([]);
    set({ activityTasks: [] });
  },

  createTask: async (title: string, description: string, instructions: string[]) => {
    const newTask = await taskUseCase.createTask(title, description, instructions);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  toggleStep: async (taskId: string, stepId: string) => {
    const updatedTask = await taskUseCase.toggleStep(taskId, stepId);
    if (updatedTask) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
    return updatedTask;
  },

  toggleTask: async (taskId: string) => {
    const updatedTask = await taskUseCase.toggleTaskCompletion(taskId);
    if (updatedTask) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
  },

  deleteTask: async (taskId: string) => {
    await taskUseCase.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },
}));
