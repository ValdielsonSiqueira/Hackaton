import React from "react";
import { Button } from "../ui/button";
import { PhoneCall } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="help-heading">
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6 sm:p-8 max-w-md w-full text-center rounded-xl shadow-2xl space-y-4">
        <PhoneCall className="w-12 h-12 text-[var(--primary)] mx-auto mb-2" aria-hidden="true" />
        <h3 id="help-heading" className="text-xl sm:text-2xl font-bold text-[var(--ink)]">Central de Ajuda SeniorEase</h3>
        <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">Você não está sozinho! Nossa equipe de suporte inclusivo SeniorEase está pronta para ajudar.</p>
        <div className="flex flex-col gap-3 pt-2">
          <Button 
            variant="primary" 
            className="w-full h-12 text-sm sm:text-base font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-lg flex items-center justify-center gap-2"
            onClick={() => { 
              onClose(); 
              alert("Chamando suporte telefônico 0800 700 8000..."); 
            }}
          >
            📞 Ligar para Suporte (0800 700 8000)
          </Button>
          <Button 
            variant="tertiary" 
            className="w-full h-10 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--hairline)] bg-[var(--canvas)] hover:bg-[var(--surface-1)] rounded-lg"
            onClick={onClose}
          >
            Fechar Ajuda
          </Button>
        </div>
      </div>
    </div>
  );
};
