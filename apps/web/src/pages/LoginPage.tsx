import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { useApp } from "../context/AppContext";

// Auth Components
import { HeroSection } from "../components/auth/HeroSection";
import { FeaturesGrid } from "../components/auth/FeaturesGrid";
import { CtaBanner } from "../components/auth/CtaBanner";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile } = useApp();

  useEffect(() => {
    if (userProfile.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [userProfile.isAuthenticated, navigate]);

  const handleAuthSuccess = (data: { name?: string; email: string }) => {
    updateUserProfile({
      name: data.name || userProfile.name || "Estudante",
      email: data.email,
      isAuthenticated: true,
    });
    navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main style={{ flex: 1 }}>
        {/* Hero & Login/Register Form Section */}
        <HeroSection
          initialName={userProfile.name}
          initialEmail={userProfile.email}
          onSuccess={handleAuthSuccess}
        />

        {/* Value Proposition Features Section */}
        <FeaturesGrid />

        {/* Call-to-action Banner */}
        <CtaBanner onAccess={() => navigate("/dashboard")} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
