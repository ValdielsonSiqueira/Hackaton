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
    <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="help-heading">
      <div className="modal-box">
        <PhoneCall className="w-12 h-12 text-[#0f62fe] mx-auto mb-4" aria-hidden="true" />
        <h3 id="help-heading">Central de Ajuda SeniorEase</h3>
        <p className="mb-6">Você não está sozinho! Nossa equipe de suporte para a terceira idade está pronta para ajudar.</p>
        <div className="modal-actions">
          <Button 
            variant="primary" 
            onClick={() => { 
              onClose(); 
              alert("Chamando suporte telefônico 0800 700 8000..."); 
            }}
          >
            📞 Ligar para Suporte (0800 700 8000)
          </Button>
          <Button variant="tertiary" onClick={onClose}>
            Fechar Ajuda
          </Button>
        </div>
      </div>
    </div>
  );
};
