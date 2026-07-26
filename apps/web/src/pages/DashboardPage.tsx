import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";
import { useApp } from "../context/AppContext";
import { isTourCompleted, startDashboardTour } from "../utils/tour";

import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import { PriorityTaskCard } from "../components/dashboard/PriorityTaskCard";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { QuickSettingsCard } from "../components/dashboard/QuickSettingsCard";
import { ModulesGrid } from "../components/dashboard/ModulesGrid";
import { RecentTasksList } from "../components/dashboard/RecentTasksList";
import { SignOutModal } from "../components/dashboard/SignOutModal";
import { HelpModal } from "../components/dashboard/HelpModal";

import { speakDashboardSummary } from "../services/speech";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentName, settings, updateSettings, updateUserProfile, activityTasks } = useApp();

  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isTourCompleted()) {
      const timer = setTimeout(() => {
        startDashboardTour();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const totalTasks = activityTasks.length;
  const nextTask = activityTasks.find((t) => !t.done && (t.urgent || t.priority === "high")) || activityTasks.find((t) => !t.done);
  const completedToday = activityTasks.filter((t) => t.done).length;
  const pendingToday = activityTasks.filter((t) => !t.done).length;
  const isSimplified = settings.navigationMode === "simplified";

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSignOutConfirm = () => {
    setShowSignoutModal(false);
    updateUserProfile({ isAuthenticated: false });
    navigate("/login");
  };

  const handleSpeakSummary = () => {
    const success = speakDashboardSummary(
      studentName,
      pendingToday,
      totalTasks,
      nextTask?.title
    );
    if (success) {
      triggerToast("🔊 Lendo resumo em voz alta...");
    } else {
      triggerToast("Navegador não suporta voz nativa");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav onSignOutClick={() => setShowSignoutModal(true)} />

      <main className="max-w-[1080px] w-full mx-auto px-4 sm:px-6 pt-20 pb-24 flex-1" role="main">
        <WelcomeBanner
          studentName={studentName}
          pendingToday={pendingToday}
          isSimplified={isSimplified}
          onSpeakSummary={handleSpeakSummary}
          onStartTour={startDashboardTour}
        />

        <PriorityTaskCard nextTask={nextTask} />

        <DashboardStats
          completedToday={completedToday}
          pendingToday={pendingToday}
        />

        {!isSimplified && (
          <QuickSettingsCard
            settings={settings}
            updateSettings={updateSettings}
            onTriggerToast={triggerToast}
          />
        )}

        <ModulesGrid onOpenHelpModal={() => setShowHelpModal(true)} />

        <RecentTasksList
          tasks={activityTasks}
          onTriggerToast={triggerToast}
        />
      </main>

      <SignOutModal
        isOpen={showSignoutModal}
        onConfirm={handleSignOutConfirm}
        onClose={() => setShowSignoutModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 bg-[#161616] text-white px-5 py-3 rounded-lg shadow-2xl z-[9999] text-sm font-semibold border border-[#393939] animate-fade-in"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
