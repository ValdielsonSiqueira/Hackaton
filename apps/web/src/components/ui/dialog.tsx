import * as React from "react"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="max-w-md w-full bg-white border border-[#E5E4E7] rounded-3xl p-8 shadow-xl relative"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 hover:text-black focus:outline-none font-bold text-lg p-2"
          aria-label="Fechar"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
export default Dialog;
