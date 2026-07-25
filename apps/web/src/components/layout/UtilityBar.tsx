import React from "react";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/button";

interface UtilityBarProps {
  title: string;
}

export const UtilityBar: React.FC<UtilityBarProps> = ({ title }) => {
  const { settings, updateSettings } = useApp();
  const scale = settings.fontScale || 1.0;

  const getLabel = (s: number) => {
    if (s <= 0.8) return "Texto Menor";
    if (s <= 0.9) return "Texto Pequeno";
    if (s <= 1.0) return "Texto Padrão";
    if (s <= 1.1) return "Texto Maior";
    if (s <= 1.2) return "Texto Grande";
    if (s <= 1.3) return "Texto Muito Grande";
    return "Texto Máximo";
  };

  const changeFontScale = (delta: number) => {
    const newScale = Math.max(0.8, Math.min(1.5, +(scale + delta).toFixed(1)));
    updateSettings({ ...settings, fontScale: newScale });
  };

  return (
    <div className="utility-bar" role="navigation" aria-label="Sub-navegação">
      <h1 className="text-sm font-semibold text-[var(--ink)]">{title}</h1>
      <div className="ub-right flex items-center gap-2">
        <span 
          className="font-size-label text-xs text-[var(--ink-muted)] font-medium mr-2" 
          id="font-scale-label" 
          aria-live="polite"
        >
          {getLabel(scale)} ({Math.round(scale * 100)}%)
        </span>
        <Button 
          variant="tertiary" 
          size="sm"
          id="font-decrease-btn" 
          onClick={() => changeFontScale(-0.1)} 
          aria-label="Diminuir texto"
          title="Diminuir texto"
          className="h-8 min-h-[32px] px-2 font-bold text-xs"
        >
          A-
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          id="font-increase-btn" 
          onClick={() => changeFontScale(0.1)} 
          aria-label="Aumentar texto"
          title="Aumentar texto"
          className="h-8 min-h-[32px] px-2 font-bold text-xs"
        >
          A+
        </Button>
      </div>
    </div>
  );
};
