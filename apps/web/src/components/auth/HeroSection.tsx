import React from "react";
import { AuthFormCard } from "./AuthFormCard";

interface HeroSectionProps {
  initialName?: string;
  initialEmail?: string;
  onSuccess: (data: { name?: string; email: string }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  initialName,
  initialEmail,
  onSuccess,
}) => {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-inner">
        {/* Left Column */}
        <div className="hero-text">
          <p className="hero-eyebrow">FIAP Inclusive</p>
          <h1 className="hero-title" id="hero-heading">
            Digital sem<br />
            <strong>complicação.</strong>
          </h1>
          <p className="hero-sub">
            O SeniorEase foi feito para você. Simples, claro e sempre do seu jeito.
          </p>
        </div>

        {/* Right Column: Shadcn Card Login */}
        <AuthFormCard
          initialName={initialName}
          initialEmail={initialEmail}
          onSuccess={onSuccess}
        />
      </div>
    </section>
  );
};
