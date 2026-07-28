import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task, UserSettings } from "@seniorease/core";
import { defaultSettings } from "@seniorease/core";
import { getMobileTheme, type MobileThemeColors } from "../theme/mobileTheme";
import { container } from "../shared/index";
import type { UserProfile } from "../data/AsyncStorageUserProfileRepository";
import type { MobileTaskItem, TaskStep } from "../data/AsyncStorageActivityRepository";

export type { UserProfile, MobileTaskItem, TaskStep };

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

  updateSettings: (newSettings: UserSettings) => Promise<void>;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  addActivityTask: (task: MobileTaskItem) => Promise<void>;
  toggleActivityTask: (id: string) => Promise<void>;
  toggleActivityStep: (taskId: string, stepId: number) => Promise<void>;
  deleteActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  stopSpeech: () => void;

  completedLessons: string[];
  completeLesson: (lessonId: string) => void;
  currentLessonId: string;
  setCurrentLessonId: (lessonId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const initialDefaultActivities: MobileTaskItem[] = [
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
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    caregiverContact: "(11) 98888-7777",
    isAuthenticated: false,
  });
  const [activityTasks, setActivityTasks] = useState<MobileTaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "2", "3"]);
  const [currentLessonId, setCurrentLessonId] = useState<string>("4");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedSettings, loadedTasks, storedProfile, storedActivities] = await Promise.all([
          container.manageSettingsUseCase.loadSettings(),
          container.manageTasksUseCase.listTasks(),
          container.userProfileRepository.getProfile(),
          container.activityRepository.getActivities(),
        ]);

        setSettings(loadedSettings);
        setTasks(loadedTasks);

        if (storedProfile) {
          setUserProfile(storedProfile);
        } else {
          setUserProfile({
            name: "",
            email: "",
            caregiverContact: "(11) 98888-7777",
            isAuthenticated: false,
          });
        }

        if (storedActivities && storedActivities.length > 0) {
          setActivityTasks(storedActivities);
        } else {
          setActivityTasks([]);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const updateSettings = async (newSettings: UserSettings) => {
    await container.manageSettingsUseCase.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const updateUserProfile = async (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    setUserProfile(updated);
    await container.userProfileRepository.saveProfile(updated);
  };

  const addActivityTask = async (task: MobileTaskItem) => {
    const updated = [task, ...activityTasks];
    setActivityTasks(updated);
    await container.activityRepository.saveActivities(updated);
  };

  const toggleActivityTask = async (id: string) => {
    const updated = activityTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setActivityTasks(updated);
    await container.activityRepository.saveActivities(updated);
  };

  const toggleActivityStep = async (taskId: string, stepId: number) => {
    const updated = activityTasks.map((task) => {
      if (task.id !== taskId) return task;
      const steps = (task.steps || []).map((s: TaskStep) => (s.id === stepId ? { ...s, done: !s.done } : s));
      const allDone = steps.length > 0 && steps.every((s: TaskStep) => s.done);
      return { ...task, steps, done: allDone };
    });
    setActivityTasks(updated);
    await container.activityRepository.saveActivities(updated);
  };

  const deleteActivityTask = async (id: string) => {
    const updated = activityTasks.filter((t) => t.id !== id);
    setActivityTasks(updated);
    await container.activityRepository.saveActivities(updated);
  };

  const speakText = (text: string) => {
    container.voiceService.speak(text);
  };

  const stopSpeech = () => {
    container.voiceService.stop();
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
