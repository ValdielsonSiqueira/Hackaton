import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { UserProfile } from "../context/AppContext";
import type { UserSettings } from "@seniorease/core";
import { ProfileInfoSection } from "../components/ProfileInfoSection";
import { ProfileHeaderCard } from "../components/profile/ProfileHeaderCard";
import { ProfileSidebarCards } from "../components/profile/ProfileSidebarCards";
import { ProfileAccessibilityFormCard } from "../components/profile/ProfileAccessibilityFormCard";
import { MobileTourModal } from "../components/MobileTourModal";

interface ProfileViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  userProfile: UserProfile;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  triggerToast: (msg: string) => void;
  speakText: (text: string) => void;
  onNavigateTab?: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  bottomInset?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  settings,
  updateSettings,
  userProfile,
  updateUserProfile,
  triggerToast,
  speakText,
  onNavigateTab,
  bottomInset = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [caregiver, setCaregiver] = useState(userProfile.caregiverContact);
  const [showProfileTour, setShowProfileTour] = useState(false);

  const handleSaveProfile = async () => {
    await updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      caregiverContact: caregiver.trim(),
    });
    triggerToast("✨ Informações do perfil salvas com sucesso!");
  };

  const userInitial = (name || "E").charAt(0).toUpperCase();

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.container, { paddingBottom: 90 + bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeaderCard
        onOpenTour={() => setShowProfileTour(true)}
        theme={theme}
      />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: primaryAccentColor }]}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileNameText, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
              {name || "Estudante"}
            </Text>
            <Text style={[styles.profileSubText, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
              Estudante SeniorEase — FIAP Inclusive
            </Text>
          </View>
        </View>

        <ProfileInfoSection
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          caregiver={caregiver}
          setCaregiver={setCaregiver}
          onSave={handleSaveProfile}
          theme={theme}
        />
      </View>

      <ProfileSidebarCards
        onNavigateTab={onNavigateTab}
        theme={theme}
      />

      <ProfileAccessibilityFormCard
        settings={settings}
        updateSettings={updateSettings}
        updateUserProfile={updateUserProfile}
        triggerToast={triggerToast}
        theme={theme}
      />

      <MobileTourModal
        visible={showProfileTour}
        theme={theme}
        onClose={() => setShowProfileTour(false)}
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
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  profileNameText: {
    fontWeight: "bold",
  },
  profileSubText: {},
});
