import React, { useState } from "react";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { useApp } from "../context/AppContext";

// Profile Modular Sub-components
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { UserProfileForm } from "../components/profile/UserProfileForm";
import { AccessibilityPreferencesForm } from "../components/profile/AccessibilityPreferencesForm";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";

export const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile, settings, updateSettings } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const handleSaveProfile = (data: { name: string; email: string; caregiverContact: string }) => {
    updateUserProfile(data);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main className="main-content" role="main" style={{ flex: 1 }}>
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1040px] mx-auto mb-8">
          {/* Column 1 & 2: Personal Data & Preferences */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <UserProfileForm
              initialName={userProfile.name}
              initialEmail={userProfile.email}
              initialCaregiverContact={userProfile.caregiverContact}
              onSave={handleSaveProfile}
              onTriggerToast={triggerToast}
            />

            <AccessibilityPreferencesForm
              settings={settings}
              updateSettings={updateSettings}
              onTriggerToast={triggerToast}
              onSaveAll={() => triggerToast("Todas as preferências foram salvas com sucesso!")}
            />
          </div>

          {/* Column 3: Persistence Status & Quick Navigation */}
          <ProfileSidebar />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
