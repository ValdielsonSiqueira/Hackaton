import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userProfile, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)] text-[var(--ink)]" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[var(--ink-muted)]">Carregando SeniorEase...</span>
        </div>
      </div>
    );
  }

  if (!userProfile.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
