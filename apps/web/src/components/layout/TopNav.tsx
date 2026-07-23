import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { 
  LogOut, 
  ArrowRight, 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  HelpCircle 
} from "lucide-react";
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
      {/* Top Header Bar */}
      <nav className="top-nav px-4 sm:px-6 py-3 flex items-center justify-between gap-2 border-b border-[var(--hairline)] bg-[var(--canvas)] sticky top-0 z-40" role="navigation" aria-label="Navegação principal">
        <Link to={isAuth ? "/dashboard" : "/login"} className="logo shrink-0" aria-label="SeniorEase">
          Senior<span>Ease</span>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuth && (
          <ul className="nav-links hidden md:flex items-center gap-6" role="list">
            <li>
              <Link to="/dashboard" className={isActive("/dashboard") ? "active font-bold text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1" : "text-[var(--ink)] hover:text-[var(--primary)]"} aria-current={isActive("/dashboard") ? "page" : undefined}>
                Painel
              </Link>
            </li>
            <li>
              <Link to="/tarefas" className={isActive("/tarefas") ? "active font-bold text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1" : "text-[var(--ink)] hover:text-[var(--primary)]"} aria-current={isActive("/tarefas") ? "page" : undefined}>
                Atividades
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={isActive("/perfil") ? "active font-bold text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1" : "text-[var(--ink)] hover:text-[var(--primary)]"} aria-current={isActive("/perfil") ? "page" : undefined}>
                Perfil
              </Link>
            </li>
            <li>
              <a href="#help" onClick={(e) => { e.preventDefault(); alert("Central de Ajuda SeniorEase: Ligue 0800 700 8000"); }} className="text-[var(--ink)] hover:text-[var(--primary)]">
                Ajuda
              </a>
            </li>
          </ul>
        )}

        <div className="nav-right flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuth && (
            <span className="nav-greeting hidden sm:inline-block text-sm font-medium text-[var(--ink)]">
              Olá, {studentName || "Estudante"} 👋
            </span>
          )}

          <div className="font-btn-group flex items-center gap-1 shrink-0 self-center">
            <button 
              type="button" 
              className="font-btn min-h-[36px] min-w-[36px] px-2 py-1 text-xs sm:text-sm font-bold border border-[var(--hairline)] rounded bg-[var(--surface-1)] text-[var(--ink)] hover:bg-[var(--primary)] hover:text-white transition-colors" 
              onClick={() => changeFontScale(-0.1)} 
              aria-label="Diminuir texto"
              title="Diminuir texto"
            >
              A-
            </button>
            <button 
              type="button" 
              className="font-btn min-h-[36px] min-w-[36px] px-2 py-1 text-xs sm:text-sm font-bold border border-[var(--hairline)] rounded bg-[var(--surface-1)] text-[var(--ink)] hover:bg-[var(--primary)] hover:text-white transition-colors" 
              onClick={() => changeFontScale(0.1)} 
              aria-label="Aumentar texto"
              title="Aumentar texto"
            >
              A+
            </button>
          </div>

          {isAuth && (
            <button 
              className="btn-nav-out min-h-[36px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28] hover:text-white transition-colors flex items-center gap-1.5 shrink-0" 
              id="sign-out-btn" 
              onClick={handleSignOutClick}
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      {isAuth && (
        <nav 
          className="fixed bottom-0 inset-x-0 z-40 bg-[var(--canvas)] border-t-2 border-[var(--primary)] shadow-2xl flex items-center justify-around h-16 md:hidden px-2" 
          aria-label="Navegação inferior mobile"
        >
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors ${
              isActive("/dashboard")
                ? "text-[var(--primary)] font-bold"
                : "text-[var(--ink-muted)] hover:text-[var(--primary)]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Painel</span>
          </Link>

          <Link
            to="/tarefas"
            className={`flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors ${
              isActive("/tarefas")
                ? "text-[var(--primary)] font-bold"
                : "text-[var(--ink-muted)] hover:text-[var(--primary)]"
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Atividades</span>
          </Link>

          <Link
            to="/perfil"
            className={`flex flex-col items-center justify-center flex-1 py-1 no-underline transition-colors ${
              isActive("/perfil")
                ? "text-[var(--primary)] font-bold"
                : "text-[var(--ink-muted)] hover:text-[var(--primary)]"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Perfil</span>
          </Link>

          <button
            type="button"
            onClick={() => alert("Central de Ajuda SeniorEase: Ligue 0800 700 8000")}
            className="flex flex-col items-center justify-center flex-1 py-1 text-[var(--ink-muted)] hover:text-[var(--primary)] border-0 bg-transparent cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Ajuda</span>
          </button>
        </nav>
      )}

      {/* Internal Modal Fallback for Sign Out Confirmation */}
      {showConfirmModal && (
        <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="topnav-modal-heading">
          <div className="modal-box p-6 max-w-sm mx-auto w-[90vw]">
            <LogOut className="w-12 h-12 text-[#da1e28] mx-auto mb-4" aria-hidden="true" />
            <h3 id="topnav-modal-heading" className="text-xl font-bold mb-2">Tem certeza que quer sair?</h3>
            <p className="text-sm text-[var(--ink-muted)]">Suas preferências estão salvas e você poderá entrar novamente quando quiser.</p>
            <div className="modal-actions flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="primary" id="modal-confirm-btn" onClick={handleConfirmSignOut} className="w-full">
                Sim, quero sair <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="tertiary" id="modal-cancel-btn" onClick={() => setShowConfirmModal(false)} className="w-full">
                Voltar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
