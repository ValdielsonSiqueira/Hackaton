import React from "react";
import { Button } from "../ui/button";
import { LogOut, ArrowRight } from "lucide-react";

interface SignOutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6 sm:p-8 max-w-sm w-full text-center rounded-xl shadow-2xl space-y-4">
        <LogOut className="w-12 h-12 text-[#da1e28] mx-auto mb-2" aria-hidden="true" />
        <h3 id="modal-heading" className="text-xl font-bold text-[var(--ink)]">Tem certeza que quer sair?</h3>
        <p className="text-sm text-[var(--ink-muted)]">Suas preferências estão salvas e você poderá entrar novamente quando quiser.</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="primary" id="modal-confirm-btn" onClick={onConfirm} className="w-full bg-[#da1e28] hover:bg-[#b81921] text-white">
            Sim, quero sair <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <Button variant="tertiary" id="modal-cancel-btn" onClick={onClose} className="w-full border border-[var(--hairline)]">
            Voltar ao painel
          </Button>
        </div>
      </div>
    </div>
  );
};
