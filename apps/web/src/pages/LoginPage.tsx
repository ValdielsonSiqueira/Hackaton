import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";
import { Footer } from "../components/layout/Footer";
import { useApp } from "../context/AppContext";

import { HeroSection } from "../components/auth/HeroSection";
import { FeaturesGrid } from "../components/auth/FeaturesGrid";
import { CtaBanner } from "../components/auth/CtaBanner";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, userProfile, loading } = useApp();

  const fromPath = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!loading && userProfile.isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [loading, userProfile.isAuthenticated, fromPath, navigate]);

  const handleAuthSuccess = (data: { name?: string; email: string }) => {
    updateUserProfile({
      name: data.name || userProfile.name || "Estudante",
      email: data.email,
      isAuthenticated: true,
    });
    navigate(fromPath);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main style={{ flex: 1 }}>
        <HeroSection
          initialName={userProfile.name}
          initialEmail={userProfile.email}
          onSuccess={handleAuthSuccess}
        />

        <FeaturesGrid />

        <CtaBanner onAccess={() => document.getElementById("login-card")?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      </main>

      <Footer />
    </div>
  );
};
