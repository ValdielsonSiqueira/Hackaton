import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task, UserSettings } from "@seniorease/core";
import { defaultSettings, ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  AsyncStorageTaskRepository, 
  AsyncStorageSettingsRepository 
} from "../data/AsyncStorageRepositories";

interface AppContextProps {
  settings: UserSettings;
  tasks: Task[];
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  createTask: (title: string, description: string, instructions: string[]) => Promise<void>;
  toggleStep: (taskId: string, stepId: string) => Promise<Task | null>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;

  // Academic custom states
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  currentLessonId: string;
  setCurrentLessonId: (lessonId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Instantiate repositories and use cases
const taskRepo = new AsyncStorageTaskRepository();
const settingsRepo = new AsyncStorageSettingsRepository();

const taskUseCase = new ManageTasks(taskRepo);
const settingsUseCase = new ManageSettings(settingsRepo);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Academic states
  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "2", "3"]);
  const [currentLessonId, setCurrentLessonId] = useState<string>("4");

  // Load initial settings and tasks
  useEffect(() => {
    async function loadData() {
      try {
        const loadedSettings = await settingsUseCase.loadSettings();
        setSettings(loadedSettings);

        const loadedTasks = await taskUseCase.listTasks();
        setTasks(loadedTasks);
      } catch (err) {
        console.error("Failed to load initial data in mobile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateSettings = async (newSettings: UserSettings) => {
    await settingsUseCase.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const createTask = async (title: string, description: string, instructions: string[]) => {
    await taskUseCase.createTask(title, description, instructions);
    const updatedTasks = await taskUseCase.listTasks();
    setTasks(updatedTasks);
  };

  const toggleStep = async (taskId: string, stepId: string) => {
    const updated = await taskUseCase.toggleStep(taskId, stepId);
    const updatedTasks = await taskUseCase.listTasks();
    setTasks(updatedTasks);
    return updated;
  };

  const toggleTask = async (taskId: string) => {
    await taskUseCase.toggleTaskCompletion(taskId);
    const updatedTasks = await taskUseCase.listTasks();
    setTasks(updatedTasks);
  };

  const deleteTask = async (taskId: string) => {
    await taskUseCase.deleteTask(taskId);
    const updatedTasks = await taskUseCase.listTasks();
    setTasks(updatedTasks);
  };

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        tasks,
        updateSettings,
        createTask,
        toggleStep,
        toggleTask,
        deleteTask,
        loading,
        completedLessons,
        completeLesson,
        currentLessonId,
        setCurrentLessonId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider in mobile");
  }
  return context;
};
