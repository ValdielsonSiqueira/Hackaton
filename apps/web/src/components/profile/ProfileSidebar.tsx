import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const ProfileSidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Persistence Status Card */}
      <Card className="p-6 bg-[#e5edff] border border-[#0f62fe]/30">
        <div className="flex items-center gap-2 text-[#0f62fe] font-semibold text-sm mb-2">
          <CheckCircle2 className="w-5 h-5" /> Armazenamento Persistente
        </div>
        <h4 className="text-lg font-semibold text-[#161616] mb-2">Suas preferências estão seguras</h4>
        <p className="text-sm text-[#525252] leading-relaxed">
          Toda alteração de tamanho de letra, alto contraste e confirmações é salva automaticamente.
        </p>
      </Card>

      {/* Navigation Card */}
      <Card className="p-6">
        <h4 className="text-base font-semibold text-[#161616] mb-4">Navegação Rápida</h4>
        <div className="flex flex-col gap-3">
          <Link to="/dashboard" className="no-underline">
            <Button variant="primary" className="w-full">
              Voltar ao Painel <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/tarefas" className="no-underline">
            <Button variant="tertiary" className="w-full">
              Ver Minhas Atividades <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
