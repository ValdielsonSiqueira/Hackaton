import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { LogOut, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface TopNavProps {
  onSignOutClick?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onSignOutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, userProfile, updateUserProfile, settings, updateSettings } = useApp();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const changeFontScale = (delta: number) => {
    const currentScale = settings.fontScale || 1.0;
    const newScale = Math.max(0.8, Math.min(1.5, +(currentScale + delta).toFixed(1)));
    document.documentElement.style.setProperty("--font-scale", String(newScale));
    updateSettings({ ...settings, fontScale: newScale });
  };

  const handleSignOutClick = () => {
    if (onSignOutClick) {
      onSignOutClick();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSignOut = () => {
    setShowConfirmModal(false);
    updateUserProfile({ isAuthenticated: false });
    navigate("/login");
  };

  const isAuth = userProfile.isAuthenticated && location.pathname !== "/login";

  return (
    <>
      <nav className="top-nav" role="navigation" aria-label="Navegação principal">
        <Link to={isAuth ? "/dashboard" : "/login"} className="logo" aria-label="SeniorEase">
          Senior<span>Ease</span>
        </Link>

        {isAuth && (
          <ul className="nav-links" role="list">
            <li>
              <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""} aria-current={isActive("/dashboard") ? "page" : undefined}>
                Painel
              </Link>
            </li>
            <li>
              <Link to="/tarefas" className={isActive("/tarefas") ? "active" : ""} aria-current={isActive("/tarefas") ? "page" : undefined}>
                Atividades
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={isActive("/perfil") ? "active" : ""} aria-current={isActive("/perfil") ? "page" : undefined}>
                Perfil
              </Link>
            </li>
            <li>
              <a href="#help" onClick={(e) => { e.preventDefault(); alert("Central de Ajuda SeniorEase: Ligue 0800 700 8000"); }}>
                Ajuda
              </a>
            </li>
          </ul>
        )}

        <div className="nav-right flex items-center gap-3">
          {isAuth && (
            <span className="nav-greeting">Olá, {studentName || "Estudante"} 👋</span>
          )}

          <div className="font-btn-group flex items-center gap-1 shrink-0 self-center">
            <button 
              type="button" 
              className="font-btn" 
              onClick={() => changeFontScale(-0.1)} 
              aria-label="Diminuir texto"
              title="Diminuir texto"
            >
              A-
            </button>
            <button 
              type="button" 
              className="font-btn" 
              onClick={() => changeFontScale(0.1)} 
              aria-label="Aumentar texto"
              title="Aumentar texto"
            >
              A+
            </button>
          </div>

          {isAuth && (
            <button className="btn-nav-out flex items-center gap-1.5" id="sign-out-btn" onClick={handleSignOutClick}>
              <LogOut className="w-4 h-4" /> Sair
            </button>
          )}
        </div>
      </nav>

      {/* Internal Modal Fallback for Sign Out Confirmation */}
      {showConfirmModal && (
        <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="topnav-modal-heading">
          <div className="modal-box">
            <LogOut className="w-12 h-12 text-[#da1e28] mx-auto mb-4" aria-hidden="true" />
            <h3 id="topnav-modal-heading">Tem certeza que quer sair?</h3>
            <p>Suas preferências estão salvas e você poderá entrar novamente quando quiser.</p>
            <div className="modal-actions flex gap-3 mt-6">
              <Button variant="primary" id="modal-confirm-btn" onClick={handleConfirmSignOut} className="flex-1">
                Sim, quero sair <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="tertiary" id="modal-cancel-btn" onClick={() => setShowConfirmModal(false)} className="flex-1">
                Voltar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
