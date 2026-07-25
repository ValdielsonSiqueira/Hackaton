import React from "react";
import { Button } from "../ui/button";
import { Compass } from "lucide-react";
import { startProfileTour } from "../../utils/tour";

export const ProfileHeader: React.FC = () => {
  return (
    <div className="section-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
        Suas Informações e Preferências
      </h2>
      <Button
        variant="tertiary"
        onClick={() => startProfileTour()}
        className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm h-10 min-h-[40px] px-3 border-[var(--hairline)] text-[var(--ink)] hover:bg-[var(--surface-1)]"
        title="Ver Tour Guiado do Perfil"
        aria-label="Ver Tour Guiado do Perfil"
      >
        <Compass className="w-4 h-4 text-[var(--primary)]" /> Tour Guiado
      </Button>
    </div>
  );
};
