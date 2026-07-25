import React from "react";
import { Settings } from "lucide-react";

export const AccessibilityTip: React.FC = () => {
  return (
    <div className="a11y-notice" role="complementary" aria-label="Dica de acessibilidade">
      <Settings className="w-6 h-6 text-[#0f62fe] shrink-0" aria-hidden="true" />
      <p>
        <strong>Quer ajustar o tamanho do texto?</strong><br />
        Use os botões <strong>A-</strong> e <strong>A+</strong> no topo para personalizar sua visão.
      </p>
    </div>
  );
};
