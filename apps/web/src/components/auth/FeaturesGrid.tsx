import React from "react";
import { Card } from "../ui/card";
import { ZoomIn, ListTodo, ShieldCheck } from "lucide-react";

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="features-section" aria-labelledby="features-heading">
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <p className="section-label">Por que o SeniorEase</p>
        <h2 id="features-heading">Feito para a sua vida</h2>
        <p>Tudo que você precisa, sem nada que atrapalhe.</p>

        <div className="feature-grid" role="list">
          <Card className="feature-card">
            <ZoomIn className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
            <h3>Texto do seu tamanho</h3>
            <p>Ajuste o tamanho das letras com um toque. A plataforma lembra sua preferência sempre que você entrar.</p>
          </Card>
          <Card className="feature-card">
            <ListTodo className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
            <h3>Tarefas simplificadas</h3>
            <p>Organize seu dia com passos claros e guiados. Nunca mais esqueça uma atividade importante.</p>
          </Card>
          <Card className="feature-card">
            <ShieldCheck className="w-8 h-8 text-[#0f62fe] mb-4" aria-hidden="true" />
            <h3>Segurança em cada clique</h3>
            <p>Antes de qualquer ação importante, a plataforma sempre pede sua confirmação. Sem surpresas.</p>
          </Card>
        </div>
      </div>
    </section>
  );
};
