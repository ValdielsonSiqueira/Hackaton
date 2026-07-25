import React, { createContext, useContext, useEffect } from "react";
import type { Task, UserSettings } from "@seniorease/core";
import type { UserProfile } from "../data/LocalStorageUserProfileRepository";
import { useAppStore } from "../store/useAppStore";

export type { UserProfile };

export const defaultUserProfile: UserProfile = {
  name: "",
  email: "",
  caregiverContact: "",
  isAuthenticated: false,
};

export interface Step {
  id: number;
  text: string;
  done: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  due: string;
  urgent?: boolean;
  done: boolean;
  priority: "high" | "medium" | "low";
  steps?: Step[];
}

interface AppContextProps {
  settings: UserSettings;
  tasks: Task[];
  userProfile: UserProfile;
  activityTasks: TaskItem[];
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  setActivityTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  addActivityTask: (task: TaskItem) => void;
  updateActivityTask: (task: TaskItem) => void;
  toggleActivityTask: (id: string) => void;
  toggleActivityStep: (taskId: string, stepId: number) => void;
  deleteActivityTask: (id: string) => void;
  clearAllActivityTasks: () => void;
  createTask: (title: string, description: string, instructions: string[]) => Promise<void>;
  toggleStep: (taskId: string, stepId: string) => Promise<Task | null>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;
  studentName: string;
  pendingToday: number;
  totalTasks: number;
  nextTask?: TaskItem;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppStore();

  useEffect(() => {
    store.initializeStore();
  }, []);

  const studentName = store.userProfile.name ? store.userProfile.name.split(" ")[0] : "Estudante";
  const pendingToday = store.activityTasks.filter((t) => !t.done).length;
  const totalTasks = store.activityTasks.length;
  const nextTask = store.activityTasks.find((t) => !t.done);

  const setActivityTasks: React.Dispatch<React.SetStateAction<TaskItem[]>> = (action) => {
    const next = typeof action === "function" ? action(store.activityTasks) : action;
    store.setActivityTasks(next);
  };

  return (
    <AppContext.Provider
      value={{
        settings: store.settings,
        tasks: store.tasks,
        userProfile: store.userProfile,
        activityTasks: store.activityTasks,
        updateSettings: store.updateSettings,
        updateUserProfile: store.updateUserProfile,
        setActivityTasks,
        addActivityTask: store.addActivityTask,
        updateActivityTask: store.updateActivityTask,
        toggleActivityTask: store.toggleActivityTask,
        toggleActivityStep: store.toggleActivityStep,
        deleteActivityTask: store.deleteActivityTask,
        clearAllActivityTasks: store.clearAllActivityTasks,
        createTask: store.createTask,
        toggleStep: store.toggleStep,
        toggleTask: store.toggleTask,
        deleteTask: store.deleteTask,
        loading: store.loading,
        studentName,
        pendingToday,
        totalTasks,
        nextTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
