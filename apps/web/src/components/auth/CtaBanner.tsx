import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  onAccess: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onAccess }) => {
  return (
    <div className="cta-banner" role="complementary">
      <h2>Pronto para começar sua jornada digital com segurança?</h2>
      <Button variant="ctaInverse" onClick={onAccess}>
        Acessar minha conta <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};
