import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task, UserSettings } from "@seniorease/core";
import { defaultSettings, ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  LocalStorageTaskRepository, 
  LocalStorageSettingsRepository 
} from "../data/LocalStorageRepositories";

export interface UserProfile {
  name: string;
  email: string;
  caregiverContact: string;
  isAuthenticated: boolean;
}

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

export const initialTasks: TaskItem[] = [
  {
    id: "1",
    title: "Entregar exercício 4",
    category: "ACADÊMICO",
    due: "HOJE 18:00",
    urgent: true,
    done: false,
    priority: "high",
    steps: [
      { id: 1, text: "Abrir o portal da FIAP e entrar na disciplina", done: true },
      { id: 2, text: "Baixar o arquivo do exercício 4", done: true },
      { id: 3, text: "Preencher o formulário de respostas", done: false },
      { id: 4, text: "Clicar em 'Enviar' e confirmar o envio", done: false },
    ],
  },
  {
    id: "2",
    title: "Aula ao vivo — UX para Idosos",
    category: "ONLINE",
    due: "HOJE 20:00",
    done: false,
    priority: "medium",
    steps: [
      { id: 1, text: "Abrir o link da aula no Zoom", done: false },
      { id: 2, text: "Testar áudio e câmera antes", done: false },
      { id: 3, text: "Anotar dúvidas durante a aula", done: false },
    ],
  },
  {
    id: "3",
    title: "Leitura do módulo 3",
    category: "LEITURA",
    due: "FEITO ÀS 09:30",
    done: true,
    priority: "low",
  },
  {
    id: "4",
    title: "Comentar no fórum da turma",
    category: "PARTICIPAÇÃO",
    due: "FEITO ÀS 11:15",
    done: true,
    priority: "low",
  },
  {
    id: "5",
    title: "Vídeo — Clean Architecture",
    category: "CONTEÚDO",
    due: "FEITO ONTEM",
    done: true,
    priority: "low",
  },
];

interface AppContextProps {
  settings: UserSettings;
  tasks: Task[];
  userProfile: UserProfile;
  activityTasks: TaskItem[];
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  setActivityTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  addActivityTask: (task: TaskItem) => void;
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
  setStudentName: (name: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const USER_PROFILE_KEY = "seniorease_user_profile";
const TASKS_KEY = "seniorease_activity_tasks";

// Instantiate repositories and use cases
const taskRepo = new LocalStorageTaskRepository();
const settingsRepo = new LocalStorageSettingsRepository();

const taskUseCase = new ManageTasks(taskRepo);
const settingsUseCase = new ManageSettings(settingsRepo);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(USER_PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.caregiverContact === "Maria (Filha) - (11) 99999-8888") {
          parsed.caregiverContact = "";
        }
        return parsed;
      }
      return defaultUserProfile;
    } catch (e) {
      return defaultUserProfile;
    }
  });

  const [activityTasks, setActivityTasksState] = useState<TaskItem[]>(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (!raw) return [];
      const parsed: TaskItem[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // If localStorage contains old hardcoded mock data, clear it so user starts fresh with real saved data
        const isOldMock = parsed.some((t) => t.id === "1" && t.title === "Entregar exercício 4");
        if (isOldMock) {
          localStorage.removeItem(TASKS_KEY);
          return [];
        }
        return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  const saveActivityTasks = (newTasks: TaskItem[]) => {
    setActivityTasksState(newTasks);
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.error("Failed to save activity tasks to localStorage", e);
    }
  };

  const setActivityTasks: React.Dispatch<React.SetStateAction<TaskItem[]>> = (action) => {
    setActivityTasksState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save activity tasks to localStorage", e);
      }
      return next;
    });
  };

  const addActivityTask = (task: TaskItem) => {
    saveActivityTasks([task, ...activityTasks]);
  };

  const toggleActivityTask = (id: string) => {
    const updated = activityTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveActivityTasks(updated);
  };

  const toggleActivityStep = (taskId: string, stepId: number) => {
    const updated = activityTasks.map((t) => {
      if (t.id === taskId && t.steps) {
        return {
          ...t,
          steps: t.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
        };
      }
      return t;
    });
    saveActivityTasks(updated);
  };

  const deleteActivityTask = (id: string) => {
    const updated = activityTasks.filter((t) => t.id !== id);
    saveActivityTasks(updated);
  };

  const clearAllActivityTasks = () => {
    saveActivityTasks([]);
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfileState((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save user profile to localStorage", e);
      }
      return updated;
    });
  };

  const studentName = userProfile.name;
  const setStudentName = (name: string) => {
    updateUserProfile({ name });
  };

  // Load initial settings and tasks
  useEffect(() => {
    async function loadData() {
      try {
        const loadedSettings = await settingsUseCase.loadSettings();
        setSettings(loadedSettings);

        const loadedTasks = await taskUseCase.listTasks();
        setTasks(loadedTasks);
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync settings with DOM variables and classes
  useEffect(() => {
    const root = document.documentElement;

    // Apply font size scale
    const scale = settings.fontScale || (settings.fontSizeScale === "large" ? 1.5 : settings.fontSizeScale === "medium" ? 1.25 : 1.0);
    root.style.setProperty("--font-scale", scale.toString());
    root.style.setProperty("--text-scale", scale.toString());

    // Apply spacing scale
    let spaceScale = 1.0;
    if (settings.spacingScale === "large") spaceScale = 1.25;
    root.style.setProperty("--spacing-scale", spaceScale.toString());

    // Apply contrast & dark classes
    if (settings.contrastMode === "high") {
      root.classList.add("high-contrast");
      root.classList.remove("dark-contrast");
    } else if (settings.contrastMode === "dark") {
      root.classList.add("dark-contrast");
      root.classList.remove("high-contrast");
    } else {
      root.classList.remove("high-contrast", "dark-contrast");
    }
  }, [settings]);

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

  return (
    <AppContext.Provider
      value={{
        settings,
        tasks,
        userProfile,
        activityTasks,
        setActivityTasks,
        addActivityTask,
        toggleActivityTask,
        toggleActivityStep,
        deleteActivityTask,
        clearAllActivityTasks,
        updateSettings,
        updateUserProfile,
        createTask,
        toggleStep,
        toggleTask,
        deleteTask,
        loading,
        studentName,
        setStudentName
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
