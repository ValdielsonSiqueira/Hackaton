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
    <section className="bg-[var(--inverse-canvas)] py-24 sm:py-36 px-4 sm:px-8 min-h-screen flex items-center justify-center" aria-labelledby="hero-heading">
      <div className="max-w-[1040px] w-full grid grid-cols-1 md:grid-cols-[1fr_480px] gap-8 md:gap-16 items-center">
        {/* Left Column */}
        <div>
          <p className="text-xs sm:text-sm font-normal tracking-wide text-[var(--inverse-ink-muted)] mb-4 uppercase">
            FIAP Inclusive
          </p>
          <h1 className="text-3xl sm:text-5xl font-light leading-tight text-[var(--inverse-ink)] mb-5" id="hero-heading">
            Digital sem<br />
            <strong className="font-semibold text-[var(--primary)]">complicação.</strong>
          </h1>
          <p className="text-base sm:text-lg font-normal leading-relaxed text-[var(--inverse-ink-muted)]">
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
