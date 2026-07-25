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
    <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className="modal-box">
        <LogOut className="w-12 h-12 text-[#da1e28] mx-auto mb-4" aria-hidden="true" />
        <h3 id="modal-heading">Tem certeza que quer sair?</h3>
        <p>Suas preferências estão salvas e você poderá entrar novamente quando quiser.</p>
        <div className="modal-actions">
          <Button variant="primary" id="modal-confirm-btn" onClick={onConfirm}>
            Sim, quero sair <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="tertiary" id="modal-cancel-btn" onClick={onClose}>
            Voltar ao painel
          </Button>
        </div>
      </div>
    </div>
  );
};
