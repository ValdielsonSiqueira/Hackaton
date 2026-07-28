import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { MobileTaskItem } from "../context/AppContext";
import type { UserSettings } from "@seniorease/core";
import { MobileTourModal, isMobileTourCompleted } from "../components/MobileTourModal";
import { DashboardWelcomeBanner } from "../components/dashboard/DashboardWelcomeBanner";
import { DashboardPriorityTaskCard } from "../components/dashboard/DashboardPriorityTaskCard";
import { DashboardStatsRow } from "../components/dashboard/DashboardStatsRow";
import { DashboardAccessibilityCard } from "../components/dashboard/DashboardAccessibilityCard";
import { DashboardModulesGrid } from "../components/dashboard/DashboardModulesGrid";
import { DashboardRecentTasksList } from "../components/dashboard/DashboardRecentTasksList";

interface DashboardViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  studentName: string;
  activityTasks: MobileTaskItem[];
  toggleActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  triggerToast: (msg: string) => void;
  onNavigateTab: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  onOpenHelpModal: () => void;
  bottomInset?: number;
}

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) {
    return { text: "Bom dia", icon: "☀️🌿" };
  } else if (hours >= 12 && hours < 18) {
    return { text: "Boa tarde", icon: "🌤️🌿" };
  } else {
    return { text: "Boa noite", icon: "🌙🌿" };
  }
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  theme,
  settings,
  updateSettings,
  studentName,
  activityTasks,
  toggleActivityTask,
  speakText,
  triggerToast,
  onNavigateTab,
  onOpenHelpModal,
  bottomInset = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    async function checkTour() {
      const completed = await isMobileTourCompleted();
      if (!completed) {
        setShowTour(true);
      }
    }
    checkTour();
  }, []);

  const contrastMode = settings.contrastMode || "standard";
  const isSimplified = settings.navigationMode === "simplified";

  const greeting = getGreeting();
  const studentFirstName = studentName ? studentName.split(" ")[0] : "Estudante";
  const pendingCount = activityTasks.filter((t) => !t.done).length;
  const completedCount = activityTasks.filter((t) => t.done).length;
  const nextTask = activityTasks.find((t) => !t.done);

  const handleSpeakSummary = () => {
    let text = `Olá, ${studentFirstName || "Estudante"}! `;
    const totalTasks = activityTasks.length;
    if (pendingCount > 0) {
      text += `Você tem ${pendingCount} ${pendingCount === 1 ? "atividade pendente" : "atividades pendentes"} hoje. `;
      if (nextTask?.title) {
        text += `Sua atividade prioritária é: ${nextTask.title}. Clique no botão para executar a atividade.`;
      }
    } else if (totalTasks > 0) {
      text += `Parabéns! Todas as suas ${totalTasks} atividades do dia foram concluídas com sucesso.`;
    } else {
      text += `Você ainda não possui atividades cadastradas hoje. Clique em Ver Atividades para adicionar novas tarefas.`;
    }
    speakText(text);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.container, { paddingBottom: 90 + bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      <DashboardWelcomeBanner
        studentFirstName={studentFirstName}
        greetingText={greeting.text}
        greetingIcon={greeting.icon}
        pendingCount={pendingCount}
        isSimplified={isSimplified}
        onSpeakSummary={handleSpeakSummary}
        onOpenTour={() => setShowTour(true)}
        theme={theme}
      />

      <DashboardPriorityTaskCard
        nextTask={nextTask}
        onExecuteNextTask={() => {
          if (nextTask) {
            toggleActivityTask(nextTask.id);
            triggerToast(`🎉 Atividade concluída!`);
          }
        }}
        onNavigateTab={onNavigateTab}
        theme={theme}
      />

      <DashboardStatsRow
        completedCount={completedCount}
        pendingCount={pendingCount}
        streakDays={7}
        theme={theme}
      />

      {!isSimplified && (
        <DashboardAccessibilityCard
          settings={settings}
          updateSettings={updateSettings}
          triggerToast={triggerToast}
          theme={theme}
        />
      )}

      <DashboardModulesGrid
        onNavigateTab={onNavigateTab}
        onOpenHelpModal={onOpenHelpModal}
        theme={theme}
      />

      <DashboardRecentTasksList
        activityTasks={activityTasks}
        toggleActivityTask={toggleActivityTask}
        speakText={speakText}
        triggerToast={triggerToast}
        onNavigateTab={onNavigateTab}
        theme={theme}
      />

      <MobileTourModal
        visible={showTour}
        theme={theme}
        onClose={() => setShowTour(false)}
        speakText={speakText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});
