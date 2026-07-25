import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--inverse-canvas)] py-12 px-6 sm:px-12 border-t border-[var(--inverse-surface-1)]" role="contentinfo">
      <span className="text-base font-semibold text-[var(--inverse-ink)] block mb-3">
        Senior<span className="text-[var(--primary)]">Ease</span>
      </span>
      <p className="text-xs text-[var(--inverse-ink-muted)] tracking-wide">
        © 2026 SeniorEase — FIAP Inclusive — Todos os direitos reservados
      </p>
    </footer>
  );
};
