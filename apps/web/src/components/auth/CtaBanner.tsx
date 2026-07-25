import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  onAccess: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onAccess }) => {
  return (
    <div className="bg-[var(--primary)] py-12 sm:py-16 px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8" role="complementary">
      <h2 className="text-2xl sm:text-3xl font-light text-white leading-snug max-w-[540px]">
        Pronto para começar sua jornada digital com segurança?
      </h2>
      <Button variant="ctaInverse" onClick={onAccess} className="bg-white text-[var(--primary)] hover:bg-[var(--surface-1)] h-14 px-8 font-semibold text-base shrink-0">
        Acessar minha conta <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};
