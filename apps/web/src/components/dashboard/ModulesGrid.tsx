import React from "react";
import { Link } from "react-router-dom";
import { 
  Sliders, 
  BookCheck, 
  User, 
  HelpCircle, 
  ArrowRight 
} from "lucide-react";

import { useHelp } from "../../context/HelpContext";

interface ModulesGridProps {
  onOpenHelpModal?: () => void;
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({ onOpenHelpModal }) => {
  const { openHelpModal } = useHelp();

  const handleHelpClick = () => {
    if (onOpenHelpModal) {
      onOpenHelpModal();
    } else {
      openHelpModal();
    }
  };

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-[var(--ink)]">Acesse os módulos</h2>
      </div>
      <div id="modules-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="list">
        <a 
          href="#qs-heading" 
          className="bg-[var(--canvas)] p-7 rounded-lg border-t-4 border-t-[var(--primary)] border-x border-b border-[var(--hairline)] hover:bg-[var(--surface-1)] transition-colors no-underline block min-h-[200px]" 
          role="listitem" 
          id="mod-personalization-btn"
        >
          <Sliders className="w-9 h-9 text-[var(--primary)] mb-4" aria-hidden="true" />
          <h3 className="text-base font-normal text-[var(--ink)] mb-2.5 leading-snug">Personalização</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">Ajuste fontes, contrastes, espaçamento e muito mais. A plataforma se adapta a você.</p>
          <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">Acessar configurações <ArrowRight className="w-4 h-4" /></span>
        </a>

        <Link 
          to="/tarefas" 
          className="bg-[var(--canvas)] p-7 rounded-lg border-t-4 border-t-[var(--success)] border-x border-b border-[var(--hairline)] hover:bg-[var(--surface-1)] transition-colors no-underline block min-h-[200px]" 
          role="listitem" 
          id="mod-tasks-btn"
        >
          <BookCheck className="w-9 h-9 text-[var(--success)] mb-4" aria-hidden="true" />
          <h3 className="text-base font-normal text-[var(--ink)] mb-2.5 leading-snug">Minhas Atividades</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">Acompanhe suas leituras, trabalhos acadêmicos e tarefas diárias de forma simples.</p>
          <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">Ver atividades <ArrowRight className="w-4 h-4" /></span>
        </Link>

        <Link 
          to="/perfil" 
          className="bg-[var(--canvas)] p-7 rounded-lg border-t-4 border-t-[#8a3ffc] border-x border-b border-[var(--hairline)] hover:bg-[var(--surface-1)] transition-colors no-underline block min-h-[200px]" 
          role="listitem" 
          id="mod-profile-btn"
        >
          <User className="w-9 h-9 text-[#8a3ffc] mb-4" aria-hidden="true" />
          <h3 className="text-base font-normal text-[var(--ink)] mb-2.5 leading-snug">Meu Perfil</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">Gerencie seus dados acadêmicos, contato de apoio e preferências da conta.</p>
          <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">Editar perfil <ArrowRight className="w-4 h-4" /></span>
        </Link>

        <div 
          onClick={handleHelpClick}
          className="bg-[var(--canvas)] p-7 rounded-lg border-t-4 border-t-[#007d79] border-x border-b border-[var(--hairline)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer block min-h-[200px]" 
          role="listitem" 
          id="mod-help-btn"
        >
          <HelpCircle className="w-9 h-9 text-[#007d79] mb-4" aria-hidden="true" />
          <h3 className="text-base font-normal text-[var(--ink)] mb-2.5 leading-snug">Central de Ajuda</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">Fale com o suporte telefônico gratuito 0800 ou veja tutoriais passo a passo.</p>
          <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">Obter ajuda <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </div>
  );
};
