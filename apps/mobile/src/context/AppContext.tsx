import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task, UserSettings } from "@seniorease/core";
import { defaultSettings, ManageTasks, ManageSettings } from "@seniorease/core";
import { 
  AsyncStorageTaskRepository, 
  AsyncStorageSettingsRepository 
} from "../data/AsyncStorageRepositories";
import { getMobileTheme, type MobileThemeColors } from "../theme/mobileTheme";
import * as Speech from "expo-speech";

export interface UserProfile {
  name: string;
  email: string;
  caregiverContact: string;
  isAuthenticated: boolean;
}

export interface TaskStep {
  id: number;
  text: string;
  done: boolean;
}

export interface MobileTaskItem {
  id: string;
  title: string;
  category: string;
  due: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  steps?: TaskStep[];
}

interface AppContextProps {
  settings: UserSettings;
  tasks: Task[];
  userProfile: UserProfile;
  activityTasks: MobileTaskItem[];
  loading: boolean;
  theme: {
    colors: MobileThemeColors;
    fontScale: number;
  };

  // Actions
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  addActivityTask: (task: MobileTaskItem) => Promise<void>;
  toggleActivityTask: (id: string) => Promise<void>;
  toggleActivityStep: (taskId: string, stepId: number) => Promise<void>;
  deleteActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  activeLibrasText: string;
  setActiveLibrasText: (text: string) => void;

  // Academic state
  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  currentLessonId: string;
  setCurrentLessonId: (lessonId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const taskRepo = new AsyncStorageTaskRepository();
const settingsRepo = new AsyncStorageSettingsRepository();
const taskUseCase = new ManageTasks(taskRepo);
const settingsUseCase = new ManageSettings(settingsRepo);

const PROFILE_KEY = "seniorease_user_profile";
const ACTIVITIES_KEY = "seniorease_activities";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Estudante",
    email: "estudante@fiap.com.br",
    caregiverContact: "(11) 98888-7777",
    isAuthenticated: true,
  });
  const [activityTasks, setActivityTasks] = useState<MobileTaskItem[]>([
    {
      id: "act-1",
      title: "Ler capítulo 1 de UX Design e Acessibilidade",
      category: "LEITURA",
      due: "HOJE 18:00",
      done: false,
      priority: "high",
      steps: [
        { id: 1, text: "Abrir o livro na página 12", done: true },
        { id: 2, text: "Ler a introdução sobre contraste", done: false },
      ],
    },
    {
      id: "act-2",
      title: "Entregar Desafio Final FIAP",
      category: "ACADÊMICO",
      due: "AMANHÃ 14:00",
      done: false,
      priority: "high",
      steps: [
        { id: 1, text: "Revisar testes unitários e E2E", done: true },
        { id: 2, text: "Subir alterações no GitHub", done: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [activeLibrasText, setActiveLibrasText] = useState<string>(
    "Olá! Selecione ou toque no texto de qualquer atividade da página para traduzir para a Língua Brasileira de Sinais."
  );

  // Academic states
  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "2", "3"]);
  const [currentLessonId, setCurrentLessonId] = useState<string>("4");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedSettings, loadedTasks, rawProfile, rawActivities] = await Promise.all([
          settingsUseCase.loadSettings(),
          taskUseCase.listTasks(),
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(ACTIVITIES_KEY),
        ]);

        setSettings(loadedSettings);
        setTasks(loadedTasks);

        if (rawProfile) {
          setUserProfile(JSON.parse(rawProfile));
        }

        if (rawActivities) {
          setActivityTasks(JSON.parse(rawActivities));
        }
      } catch (err) {
        console.error("Failed to load initial data in mobile", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const updateSettings = async (newSettings: UserSettings) => {
    await settingsUseCase.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const updateUserProfile = async (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    setUserProfile(updated);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  };

  const addActivityTask = async (task: MobileTaskItem) => {
    const updated = [task, ...activityTasks];
    setActivityTasks(updated);
    await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  };

  const toggleActivityTask = async (id: string) => {
    const updated = activityTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setActivityTasks(updated);
    await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  };

  const toggleActivityStep = async (taskId: string, stepId: number) => {
    const updated = activityTasks.map((task) => {
      if (task.id !== taskId) return task;
      const steps = (task.steps || []).map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
      const allDone = steps.length > 0 && steps.every((s) => s.done);
      return { ...task, steps, done: allDone };
    });
    setActivityTasks(updated);
    await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  };

  const deleteActivityTask = async (id: string) => {
    const updated = activityTasks.filter((t) => t.id !== id);
    setActivityTasks(updated);
    await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  };

  const speakText = (text: string) => {
    setActiveLibrasText(text);
    try {
      Speech.stop();
      Speech.speak(text, { language: "pt-BR", rate: 0.85 });
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  const stopSpeech = () => {
    try {
      Speech.stop();
    } catch (e) {}
  };

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const theme = getMobileTheme(settings);

  return (
    <AppContext.Provider
      value={{
        settings,
        tasks,
        userProfile,
        activityTasks,
        loading,
        theme,
        updateSettings,
        updateUserProfile,
        addActivityTask,
        toggleActivityTask,
        toggleActivityStep,
        deleteActivityTask,
        speakText,
        stopSpeech,
        completedLessons,
        completeLesson,
        currentLessonId,
        setCurrentLessonId,
        activeLibrasText,
        setActiveLibrasText,
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
