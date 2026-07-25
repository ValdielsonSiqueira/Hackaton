import React from "react";
import { Card } from "../ui/card";
import { ZoomIn, ListTodo, ShieldCheck } from "lucide-react";

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="bg-[var(--surface-1)] py-16 sm:py-24 px-4 sm:px-8" aria-labelledby="features-heading">
      <div className="max-w-[1080px] mx-auto">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">
          Por que o SeniorEase
        </p>
        <h2 className="text-3xl sm:text-4xl font-light text-[var(--ink)] mb-3 leading-tight" id="features-heading">
          Feito para a sua vida
        </h2>
        <p className="text-base sm:text-lg text-[var(--ink-muted)] mb-12 sm:mb-16 max-w-[560px]">
          Tudo que você precisa, sem nada que atrapalhe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" role="list">
          <Card className="bg-[var(--canvas)] p-6 sm:p-8 rounded-lg border border-[var(--hairline)] shadow-sm">
            <ZoomIn className="w-8 h-8 text-[var(--primary)] mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-[var(--ink)] mb-2 leading-snug">Texto do seu tamanho</h3>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Ajuste o tamanho das letras com um toque. A plataforma lembra sua preferência sempre que você entrar.
            </p>
          </Card>
          <Card className="bg-[var(--canvas)] p-6 sm:p-8 rounded-lg border border-[var(--hairline)] shadow-sm">
            <ListTodo className="w-8 h-8 text-[var(--primary)] mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-[var(--ink)] mb-2 leading-snug">Tarefas simplificadas</h3>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Organize seu dia com passos claros e guiados. Nunca mais esqueça uma atividade importante.
            </p>
          </Card>
          <Card className="bg-[var(--canvas)] p-6 sm:p-8 rounded-lg border border-[var(--hairline)] shadow-sm">
            <ShieldCheck className="w-8 h-8 text-[var(--primary)] mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-[var(--ink)] mb-2 leading-snug">Segurança em cada clique</h3>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Antes de qualquer ação importante, a plataforma sempre pede sua confirmação. Sem surpresas.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
