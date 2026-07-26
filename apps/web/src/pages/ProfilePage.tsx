import React, { useState } from "react";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { useApp } from "../context/AppContext";

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
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="max-w-[1080px] w-full mx-auto px-4 sm:px-6 pt-20 pb-24 flex-1" role="main">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1040px] mx-auto mb-8">
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

          <ProfileSidebar />
        </div>
      </main>
      <Footer />
      {toastMsg && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
