import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="max-w-md w-full bg-[var(--canvas)] border border-[var(--hairline)] rounded-3xl p-8 shadow-xl relative text-[var(--ink)]"
        role="dialog"
        aria-modal="true"
      >
        <Button 
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink)] min-h-[40px] h-10 w-10 min-w-[40px] p-0 flex items-center justify-center border-0 bg-transparent cursor-pointer"
          aria-label="Fechar"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
