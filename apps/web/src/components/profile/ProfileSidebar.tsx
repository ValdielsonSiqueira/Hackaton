import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const ProfileSidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-xl">
        <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-sm mb-2">
          <CheckCircle2 className="w-5 h-5" /> Armazenamento Persistente
        </div>
        <h4 className="text-lg font-semibold text-[var(--ink)] mb-2">Suas preferências estão seguras</h4>
        <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
          Toda alteração de tamanho de letra, alto contraste e confirmações é salva automaticamente.
        </p>
      </Card>

      <Card className="p-6 bg-[var(--canvas)] border border-[var(--hairline)] rounded-xl">
        <h4 className="text-base font-semibold text-[var(--ink)] mb-4">Navegação Rápida</h4>
        <div className="flex flex-col gap-3">
          <Link to="/dashboard" className="no-underline">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              Voltar ao Painel <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/tarefas" className="no-underline">
            <Button variant="tertiary" className="w-full flex items-center justify-center gap-2 border border-[var(--hairline)]">
              Ver Minhas Atividades <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
