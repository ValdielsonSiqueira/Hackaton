import React, { useState } from "react";

interface UtilityBarProps {
  title: string;
}

export const UtilityBar: React.FC<UtilityBarProps> = ({ title }) => {
  const [scale, setScale] = useState(1);

  const getLabel = (s: number) => {
    if (s <= 0.8) return "Texto Menor";
    if (s <= 0.9) return "Texto Pequeno";
    if (s === 1.0) return "Texto Padrão";
    if (s <= 1.1) return "Texto Maior";
    if (s <= 1.2) return "Texto Grande";
    if (s <= 1.3) return "Texto Muito Grande";
    return "Texto Máximo";
  };

  const changeFontScale = (delta: number) => {
    const newScale = Math.max(0.8, Math.min(1.5, +(scale + delta).toFixed(1)));
    setScale(newScale);
    document.documentElement.style.setProperty("--font-scale", String(newScale));
  };

  return (
    <div className="utility-bar" role="navigation" aria-label="Sub-navegação">
      <h1>{title}</h1>
      <div className="ub-right">
        <span className="font-size-label" id="font-scale-label" aria-live="polite" style={{ fontSize: "12px", color: "var(--ink-subtle)", letterSpacing: "0.32px", marginRight: "8px" }}>
          {getLabel(scale)} ({Math.round(scale * 100)}%)
        </span>
        <button className="font-btn" id="font-decrease-btn" onClick={() => changeFontScale(-0.1)} aria-label="Diminuir texto">
          A-
        </button>
        <button className="font-btn" id="font-increase-btn" onClick={() => changeFontScale(0.1)} aria-label="Aumentar texto">
          A+
        </button>
      </div>
    </div>
  );
};
