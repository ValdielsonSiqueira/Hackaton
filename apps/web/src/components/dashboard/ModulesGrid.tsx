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
      <div className="section-header">
        <h2>Acesse os módulos</h2>
      </div>
      <div className="modules-grid" role="list">
        <a href="#qs-heading" className="module-card mod-blue" role="listitem" id="mod-personalization-btn">
          <Sliders className="w-9 h-9 text-[#0f62fe] mb-4" aria-hidden="true" />
          <h3>Personalização</h3>
          <p>Ajuste fontes, contrastes, espaçamento e muito mais. A plataforma se adapta a você.</p>
          <span className="mod-cta flex items-center gap-1">Acessar configurações <ArrowRight className="w-4 h-4" /></span>
        </a>

        <Link to="/tarefas" className="module-card mod-green" role="listitem" id="mod-tasks-btn">
          <BookCheck className="w-9 h-9 text-[#24a148] mb-4" aria-hidden="true" />
          <h3>Minhas Atividades</h3>
          <p>Acompanhe suas leituras, trabalhos acadêmicos e tarefas diárias de forma simples.</p>
          <span className="mod-cta flex items-center gap-1">Ver atividades <ArrowRight className="w-4 h-4" /></span>
        </Link>

        <Link to="/perfil" className="module-card mod-purple" role="listitem" id="mod-profile-btn">
          <User className="w-9 h-9 text-[#8a3ffc] mb-4" aria-hidden="true" />
          <h3>Meu Perfil</h3>
          <p>Gerencie seus dados acadêmicos, contato de apoio e preferências da conta.</p>
          <span className="mod-cta flex items-center gap-1">Editar perfil <ArrowRight className="w-4 h-4" /></span>
        </Link>

        <div 
          onClick={handleHelpClick}
          className="module-card mod-teal cursor-pointer" 
          role="listitem" 
          id="mod-help-btn"
        >
          <HelpCircle className="w-9 h-9 text-[#007d79] mb-4" aria-hidden="true" />
          <h3>Central de Ajuda</h3>
          <p>Fale com o suporte telefônico gratuito 0800 ou veja tutoriais passo a passo.</p>
          <span className="mod-cta flex items-center gap-1">Obter ajuda <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </div>
  );
};
