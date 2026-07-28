import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Platform, 
  StatusBar as RNStatusBar 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { 
  SafeAreaProvider, 
  useSafeAreaInsets 
} from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppProvider, useApp } from "./src/context/AppContext";

// Import Modular Views
import { LoginView } from "./src/views/LoginView";
import { DashboardView } from "./src/views/DashboardView";
import { TasksView } from "./src/views/TasksView";
import { ProfileView } from "./src/views/ProfileView";
import { HelpModalView } from "./src/views/HelpModalView";

// Import Floating Accessibility Toolbar
import { AccessibilityToolbarMobile } from "./src/components/AccessibilityToolbarMobile";

// Import Safety & Guided Tour Components
import { SignOutModalMobile } from "./src/components/SignOutModalMobile";

import { 
  Sparkles, 
  BookCheck, 
  User, 
  HelpCircle, 
  Volume2, 
  LogOut,
  LayoutDashboard,
  CheckSquare
} from "lucide-react-native";

function MainAppContent() {
  const insets = useSafeAreaInsets();
  const { 
    settings, 
    updateSettings, 
    userProfile, 
    updateUserProfile, 
    activityTasks,
    addActivityTask,
    updateActivityTask,
    toggleActivityTask,
    toggleActivityStep, 
    deleteActivityTask, 
    theme, 
    speakText,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks" | "profile" | "help">("dashboard");
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { colors, fontScale } = theme;
  const isSimplified = settings.navigationMode === "simplified";
  const studentFirstName = userProfile.name ? userProfile.name.split(" ")[0] : "Estudante";
  const pendingCount = activityTasks.filter((t) => !t.done).length;

  const triggerToast = (msg: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLoginSuccess = async (email: string, name?: string) => {
    setActiveTab("dashboard");
    await updateUserProfile({
      email,
      name: name || userProfile.name || "Estudante FIAP",
      isAuthenticated: true,
    });
    triggerToast("✨ Bem-vindo ao SeniorEase!");
  };

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false);
    await updateUserProfile({ isAuthenticated: false });
    triggerToast("Você saiu da sua conta.");
  };

  const topInset = Math.max(insets.top, Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0);
  const bottomInset = Math.max(insets.bottom, 12);

  // 1. UNAUTHENTICATED (LOGIN VIEW)
  if (!userProfile.isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
        <StatusBar style={settings.contrastMode === "dark" ? "light" : "dark"} translucent />
        <LoginView
          theme={theme}
          onLoginSuccess={handleLoginSuccess}
          onOpenHelpModal={() => setHelpModalVisible(true)}
          speakText={speakText}
        />
        <AccessibilityToolbarMobile
          settings={settings}
          updateSettings={updateSettings}
          theme={theme}
          topInset={topInset}
        />
        <HelpModalView
          visible={helpModalVisible}
          theme={theme}
          onClose={() => setHelpModalVisible(false)}
        />
      </View>
    );
  }

  // 2. MAIN AUTHENTICATED APPLICATION
  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset }]}>
      <StatusBar style={settings.contrastMode === "dark" ? "light" : "dark"} translucent />

      {/* Top Header Navigation (Below Device Notch/Status Bar) */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: colors.borderWidth }]}>
        <View style={styles.logoRow}>
          <Text style={[styles.logoText, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
            Senior<Text style={{ color: colors.primary }}>Ease</Text>
          </Text>
          {isSimplified && (
            <View style={[styles.simplifiedBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.simplifiedBadgeText}>Modo Simplificado</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={[styles.audioHeaderBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => speakText(`SeniorEase. Olá, ${studentFirstName}! Você possui ${pendingCount} atividades pendentes.`)}
            accessibilityLabel="Ouvir resumo em áudio"
          >
            <Volume2 size={Math.round(20 * fontScale)} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.audioHeaderBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => setShowSignOutModal(true)}
            accessibilityLabel="Sair da Conta"
          >
            <LogOut size={Math.round(18 * fontScale)} color={colors.urgent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Screen View */}
      <View style={{ flex: 1, paddingBottom: 64 + bottomInset }}>
        {activeTab === "dashboard" && (
          <DashboardView
            theme={theme}
            settings={settings}
            updateSettings={updateSettings}
            studentName={userProfile.name}
            activityTasks={activityTasks}
            toggleActivityTask={toggleActivityTask}
            speakText={speakText}
            triggerToast={triggerToast}
            onNavigateTab={setActiveTab}
            onOpenHelpModal={() => setHelpModalVisible(true)}
            bottomInset={bottomInset}
          />
        )}

        {activeTab === "tasks" && (
          <TasksView
            theme={theme}
            activityTasks={activityTasks}
            addActivityTask={addActivityTask}
            updateActivityTask={updateActivityTask}
            toggleActivityTask={toggleActivityTask}
            toggleActivityStep={toggleActivityStep}
            deleteActivityTask={deleteActivityTask}
            speakText={speakText}
            triggerToast={triggerToast}
            bottomInset={bottomInset}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            theme={theme}
            settings={settings}
            updateSettings={updateSettings}
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
            triggerToast={triggerToast}
            speakText={speakText}
            bottomInset={bottomInset}
          />
        )}

        {activeTab === "help" && (
          <View style={{ flex: 1 }}>
            <HelpModalView
              visible={true}
              theme={theme}
              onClose={() => setActiveTab("dashboard")}
            />
          </View>
        )}
      </View>

      {/* Floating Accessibility Toolbar */}
      <AccessibilityToolbarMobile
        settings={settings}
        updateSettings={updateSettings}
        theme={theme}
        topInset={topInset}
      />

      {/* Global Help Modal */}
      {activeTab !== "help" && (
        <HelpModalView
          visible={helpModalVisible}
          theme={theme}
          onClose={() => setHelpModalVisible(false)}
        />
      )}

      {/* Sign Out Confirmation Modal */}
      <SignOutModalMobile
        visible={showSignOutModal}
        theme={theme}
        onClose={() => setShowSignOutModal(false)}
        onConfirmSignOut={handleConfirmSignOut}
      />

      {/* Toast Feedback */}
      {toastMsg && (
        <View style={[styles.toastContainer, { bottom: 74 + bottomInset }]}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Bottom Navigation Tab Bar (Respecting Device Safe Area Bottom Inset) */}
      <View
        style={[
          styles.bottomTabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.primary,
            borderTopWidth: colors.borderWidth,
            paddingBottom: bottomInset + 4,
            minHeight: 76 + bottomInset,
            paddingTop: 6,
          },
        ]}
      >
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("dashboard")}>
          <LayoutDashboard size={26} color={activeTab === "dashboard" ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabItemLabel, { color: activeTab === "dashboard" ? colors.primary : colors.textMuted }]}>
            Painel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("tasks")}>
          <CheckSquare size={26} color={activeTab === "tasks" ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabItemLabel, { color: activeTab === "tasks" ? colors.primary : colors.textMuted }]}>
            Atividades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("profile")}>
          <User size={26} color={activeTab === "profile" ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabItemLabel, { color: activeTab === "profile" ? colors.primary : colors.textMuted }]}>
            Perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setHelpModalVisible(true)}>
          <HelpCircle size={26} color={colors.textMuted} />
          <Text style={[styles.tabItemLabel, { color: colors.textMuted }]}>
            Ajuda
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontWeight: "bold",
  },
  simplifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  simplifiedBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  audioHeaderBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#161616",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 9999,
  },
  toastText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  bottomTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabItemLabel: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 4,
  },
});
