import React from "react";
import { Button } from "../ui/button";

interface AuthModeSwitchProps {
  isRegisterMode: boolean;
  onToggleMode: () => void;
}

export const AuthModeSwitch: React.FC<AuthModeSwitchProps> = ({
  isRegisterMode,
  onToggleMode,
}) => {
  return (
    <div className="text-center pt-2">
      <Button
        type="button"
        variant="tertiary"
        onClick={onToggleMode}
        className="text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline cursor-pointer border-0 p-0 h-auto bg-transparent min-h-0"
        id="toggle-auth-mode-btn"
      >
        {isRegisterMode
          ? "Já tem uma conta? Clique para entrar"
          : "Ainda não tem conta? Clique para criar"}
      </Button>
    </div>
  );
};
