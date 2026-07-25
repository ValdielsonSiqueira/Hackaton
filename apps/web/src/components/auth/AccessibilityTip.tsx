import React from "react";
import { Settings } from "lucide-react";

export const AccessibilityTip: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-[var(--surface-1)] border-l-4 border-l-[var(--primary)] rounded-r-lg flex items-start gap-3" role="complementary" aria-label="Dica de acessibilidade">
      <Settings className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed m-0">
        <strong className="text-[var(--ink)] font-semibold">Quer ajustar o tamanho do texto?</strong><br />
        Use os botões <strong className="text-[var(--ink)] font-semibold">A-</strong> e <strong className="text-[var(--ink)] font-semibold">A+</strong> no topo para personalizar sua visão.
      </p>
    </div>
  );
};
