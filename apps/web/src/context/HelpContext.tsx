import React, { createContext, useContext, useState } from "react";
import { HelpModal } from "../components/dashboard/HelpModal";

interface HelpContextType {
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  return (
    <HelpContext.Provider value={{ isHelpModalOpen, openHelpModal, closeHelpModal }}>
      {children}
      <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
    </HelpContext.Provider>
  );
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error("useHelp deve ser usado dentro de um HelpProvider");
  }
  return context;
};
