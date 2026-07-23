import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TopNav } from "../components/layout/TopNav";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { isTourCompleted, startDashboardTour } from "../utils/tour";
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Settings, 
  Sliders, 
  BookCheck, 
  User, 
  HelpCircle, 
  LogOut, 
  ArrowRight,
  BookOpen,
  FileCheck,
  Video,
  MessageSquare,
  Volume2,
  Target,
  PhoneCall,
  Sparkles,
  ZoomIn,
  Eye,
  RotateCcw,
  ShieldCheck,
  Sun,
  Moon,
  Plus,
  Compass
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentName, settings, updateSettings, updateUserProfile, activityTasks } = useApp();

  useEffect(() => {
    if (!isTourCompleted()) {
      const timer = setTimeout(() => {
        startDashboardTour();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const nextTask = activityTasks.find((t) => !t.done && (t.urgent || t.priority === "high")) || activityTasks.find((t) => !t.done);
  const completedToday = activityTasks.filter((t) => t.done).length;
  const pendingToday = activityTasks.filter((t) => !t.done).length;

  const getActivityIcon = (category: string) => {
    const cat = (category || "").toUpperCase();
    if (cat.includes("AULA") || cat.includes("ONLINE")) return <Video className="w-5 h-5 text-[#0f62fe]" />;
    if (cat.includes("LEITURA")) return <BookOpen className="w-5 h-5 text-[#0f62fe]" />;
    if (cat.includes("PARTICIPAÇ") || cat.includes("FÓRUM")) return <MessageSquare className="w-5 h-5 text-[#24a148]" />;
    return <FileCheck className="w-5 h-5 text-[#161616]" />;
  };

  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSignOutConfirm = () => {
    setShowSignoutModal(false);
    updateUserProfile({ isAuthenticated: false });
    navigate("/login");
  };

  const handleSpeakSummary = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `Bom dia ${studentName || "Estudante"}! Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. ${
        nextTask ? `Sua atividade prioritária é ${nextTask.title}.` : "Você não possui atividades pendentes."
      } Clique em executar atividade para começar.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      triggerToast("🔊 Lendo resumo do dia em voz alta...");
    } else {
      triggerToast("Navegador não suporta voz nativa");
    }
  };

  const fontScale = settings.fontScale || 1.0;
  const contrastMode = settings.contrastMode || "standard";

  const changeFontScale = async (delta: number) => {
    const newScale = Math.max(0.8, Math.min(1.5, +(fontScale + delta).toFixed(1)));
    await updateSettings({ ...settings, fontScale: newScale });
    triggerToast(`Tamanho do texto: ${Math.round(newScale * 100)}%`);
  };

  const applyContrast = async (mode: "standard" | "high" | "dark") => {
    await updateSettings({ ...settings, contrastMode: mode });
    if (mode === "high") {
      triggerToast("Alto contraste ativado");
    } else if (mode === "dark") {
      triggerToast("Modo escuro ativado");
    } else {
      triggerToast("Contraste padrão redefinido");
    }
  };

  const handleResetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
    triggerToast("Todas as preferências foram resetadas para o padrão!");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav onSignOutClick={() => setShowSignoutModal(true)} />

      <main className="main-content" role="main">
        {/* Welcome Banner */}
        <div className="welcome-banner" role="banner">
          <div className="welcome-text" style={{ flex: 1 }}>
            <h2>Bom dia, {studentName || "Estudante"}! ☀️🌿</h2>
            <p className="mb-4">
              {pendingToday > 0
                ? `Você tem ${pendingToday} ${pendingToday === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
                : "Você está em dia com todas as suas tarefas hoje!"}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                variant="tertiary" 
                onClick={handleSpeakSummary}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-white" /> Ouvir resumo por voz
              </Button>

              <Button 
                variant="tertiary" 
                onClick={() => startDashboardTour()}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm h-10 min-h-[40px] px-4 w-auto inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-white" /> Ver Tour Guiado
              </Button>
            </div>
          </div>
          <div className="welcome-illustration text-white flex items-center gap-2" aria-hidden="true">
            <BookOpen className="w-16 h-16 text-[#0f62fe]" />
          </div>
        </div>

        {/* Hero Priority Action Card (Próxima Atividade Recomendada) */}
        <Card className="mb-8 border-l-4 border-l-[#0f62fe] bg-[#f4f4f4] p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0f62fe] text-white flex items-center justify-center shrink-0 mt-1">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0f62fe] flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Próxima Atividade Prioritária
                </span>
                <h3 className="text-xl font-normal text-[#161616] mb-1">
                  {nextTask ? nextTask.title : "Nenhuma atividade pendente"}
                </h3>
                <p className="text-sm text-[#525252]">
                  {nextTask ? `Vence ${nextTask.due} — Atividade prioritária.` : "Parabéns! Todas as suas tarefas foram concluídas."}
                </p>
              </div>
            </div>
            <Link to="/tarefas" style={{ textDecoration: "none" }}>
              <Button variant="primary" className="whitespace-nowrap flex items-center gap-2">
                {nextTask ? "Executar Atividade Agora" : "Ver Todas as Atividades"} <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Stats */}
        <div className="stats-row" role="list" aria-label="Resumo das suas atividades" style={{ marginTop: "1px" }}>
          <Card className="stat-card" role="listitem">
            <CheckCircle2 className="w-7 h-7 text-[#24a148] mb-3" aria-hidden="true" />
            <div className="stat-number green">{completedToday}</div>
            <div className="stat-label">Concluídas hoje</div>
          </Card>
          <Card className="stat-card" role="listitem">
            <Clock className="w-7 h-7 text-[#161616] mb-3" aria-hidden="true" />
            <div className="stat-number">{pendingToday}</div>
            <div className="stat-label">Pendentes</div>
          </Card>
          <Card className="stat-card" role="listitem">
            <Flame className="w-7 h-7 text-[#0f62fe] mb-3" aria-hidden="true" />
            <div className="stat-number blue">7</div>
            <div className="stat-label">Dias seguidos</div>
          </Card>
        </div>

        {/* Quick Settings */}
        <Card className="quick-settings" role="region" aria-labelledby="qs-heading">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-[var(--hairline)]">
            <h3 className="qs-heading flex items-center gap-2 mb-0" id="qs-heading">
              <Settings className="w-5 h-5 text-[var(--primary)]" /> Preferências Rápidas de Acessibilidade
            </h3>
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleResetAll}
              className="h-9 text-xs px-3 border-[#da1e28] text-[#da1e28] hover:bg-[#fff0f0] flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resetar Ajustes
            </Button>
          </div>

          <div className="qs-grid">
            {/* 1. Tamanho do Texto */}
            <div className="qs-item">
              <div>
                <label className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
                  <ZoomIn className="w-4 h-4 text-[var(--primary)] shrink-0" /> Tamanho do Texto
                </label>
                <p className="text-xs text-[var(--ink-muted)] mb-3">Aumente ou diminua as letras da página</p>
              </div>
              <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full min-w-0">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => changeFontScale(-0.1)}
                  className="w-full h-9 min-h-[36px] font-bold text-sm"
                  title="Diminuir texto"
                >
                  A-
                </Button>
                <div className="text-xs font-bold text-[var(--ink)] text-center py-1.5 bg-[var(--surface-1)] border border-[var(--hairline)] w-full">
                  {Math.round(fontScale * 100)}%
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => changeFontScale(0.1)}
                  className="w-full h-9 min-h-[36px] font-bold text-sm"
                  title="Aumentar texto"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* 2. Modos de Contraste */}
            <div className="qs-item">
              <div>
                <label className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-[var(--primary)] shrink-0" /> Tema e Contraste
                </label>
                <p className="text-xs text-[var(--ink-muted)] mb-3">Escolha a cor de fundo mais confortável</p>
              </div>
              <div className="flex flex-col gap-1.5 w-full min-w-0">
                <button
                  type="button"
                  onClick={() => applyContrast("standard")}
                  className={`w-full py-2 px-3 text-xs font-semibold border cursor-pointer transition-colors flex items-center justify-center gap-2 ${contrastMode === "standard" ? "bg-[#0f62fe] text-white border-[#0f62fe]" : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)]"}`}
                >
                  <Sun className="w-4 h-4 shrink-0" /> Padrão (Branco)
                </button>
                <button
                  type="button"
                  onClick={() => applyContrast("high")}
                  className={`w-full py-2 px-3 text-xs font-semibold border cursor-pointer transition-colors flex items-center justify-center gap-2 ${contrastMode === "high" ? "bg-[#000000] text-white border-[#000000]" : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)]"}`}
                >
                  <Eye className="w-4 h-4 shrink-0" /> Alto Contraste
                </button>
                <button
                  type="button"
                  onClick={() => applyContrast("dark")}
                  className={`w-full py-2 px-3 text-xs font-semibold border cursor-pointer transition-colors flex items-center justify-center gap-2 ${contrastMode === "dark" ? "bg-[#161616] text-[#f1c21b] border-[#161616]" : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)]"}`}
                >
                  <Moon className="w-4 h-4 shrink-0" /> Modo Escuro
                </button>
              </div>
            </div>

            {/* 3. Recursos de Proteção & Voz */}
            <div className="qs-item">
              <div>
                <label className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#24a148] shrink-0" /> Proteções & Leitura
                </label>
                <p className="text-xs text-[var(--ink-muted)] mb-3">Confirmações antes de ações e áudio</p>
              </div>
              <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full min-w-0">
                <div className="flex items-center justify-between gap-2 w-full p-1 border-b border-[var(--hairline)] border-dashed">
                  <label htmlFor="qs-confirm" className="text-xs text-[var(--ink)] cursor-pointer font-medium">Confirmar Ações</label>
                  <Switch id="qs-confirm" defaultChecked onCheckedChange={(checked) => triggerToast(checked ? "Confirmação ativada" : "Desativada")} />
                </div>
                <div className="flex items-center justify-between gap-2 w-full p-1">
                  <label htmlFor="qs-voice" className="text-xs text-[var(--ink)] cursor-pointer font-medium">Lembretes por Voz</label>
                  <Switch id="qs-voice" defaultChecked onCheckedChange={(checked) => triggerToast(checked ? "Voz ativada" : "Desativada")} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Modules Grid */}
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
            <Badge variant="success" className="absolute top-5 right-5 text-[0.75rem] px-2.5 py-1" aria-label="2 pendentes">2 pendentes</Badge>
            <BookCheck className="w-9 h-9 text-[#24a148] mb-4" aria-hidden="true" />
            <h3>Minhas Atividades</h3>
            <p>Lista simples e clara com suas tarefas do dia. Com lembretes e passos guiados.</p>
            <span className="mod-cta flex items-center gap-1">Ver atividades <ArrowRight className="w-4 h-4" /></span>
          </Link>

          <Link to="/perfil" className="module-card mod-warning" role="listitem" id="mod-profile-btn">
            <User className="w-9 h-9 text-[#f1c21b] mb-4" aria-hidden="true" />
            <h3>Meu Perfil</h3>
            <p>Suas informações e preferências salvas. Tudo fica guardado para a próxima visita.</p>
            <span className="mod-cta flex items-center gap-1">Ver perfil <ArrowRight className="w-4 h-4" /></span>
          </Link>

          <a href="#suporte" onClick={(e) => { e.preventDefault(); setShowHelpModal(true); }} className="module-card mod-dark" role="listitem" id="mod-help-btn">
            <HelpCircle className="w-9 h-9 text-[#161616] mb-4" aria-hidden="true" />
            <h3>Preciso de Ajuda</h3>
            <p>Encontrou alguma dificuldade? Nossa equipe está pronta para te auxiliar.</p>
            <span className="mod-cta flex items-center gap-1">Falar com suporte <ArrowRight className="w-4 h-4" /></span>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="section-header">
          <h2>Atividade recente</h2>
        </div>
        <Card className="recent-activity" role="region" aria-labelledby="ra-heading">
          <div className="ra-header flex items-center justify-between mb-4">
            <h3 id="ra-heading">Histórico de hoje</h3>
            <Link to="/tarefas" style={{ textDecoration: "none" }}>
              <Button variant="tertiary" size="sm" className="h-10 min-h-[40px] text-sm px-4 inline-flex items-center gap-1.5">
                Ver tudo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {activityTasks.length === 0 ? (
            <div className="empty-state p-8 text-center bg-[var(--canvas)] border border-[var(--hairline)] rounded-sm my-3 flex flex-col items-center justify-center">
              <Sparkles className="w-12 h-12 text-[#0f62fe] mb-3 opacity-60" aria-hidden="true" />
              <h4 className="text-xl font-medium text-[#161616] mb-1">Nenhuma atividade recente</h4>
              <p className="text-sm text-[#525252] mb-4 max-w-[400px]">
                Você ainda não possui atividades cadastradas. Suas atividades aparecerão aqui assim que forem adicionadas.
              </p>
              <Link to="/tarefas" style={{ textDecoration: "none" }}>
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Atividade
                </Button>
              </Link>
            </div>
          ) : (
            activityTasks.slice(0, 4).map((t) => (
              <div key={t.id} className="activity-item" role="article">
                <div className="activity-icon" aria-hidden="true">
                  {getActivityIcon(t.category)}
                </div>
                <div className="activity-text">
                  <div className="title">{t.title}</div>
                  <div className="time">{t.done ? `Concluído (${t.due})` : `Até ${t.due}`}</div>
                </div>
                <Badge variant={t.done ? "success" : "pending"} className="ml-auto text-[0.8rem] px-3 py-1 flex items-center gap-1">
                  {t.done ? "✓ Feito" : "⏳ Pendente"}
                </Badge>
              </div>
            ))
          )}
        </Card>
      </main>

      {/* Sign Out Modal */}
      {showSignoutModal && (
        <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
          <div className="modal-box">
            <LogOut className="w-12 h-12 text-[#da1e28] mx-auto mb-4" aria-hidden="true" />
            <h3 id="modal-heading">Tem certeza que quer sair?</h3>
            <p>Suas preferências estão salvas e você poderá entrar novamente quando quiser.</p>
            <div className="modal-actions">
              <Button variant="primary" id="modal-confirm-btn" onClick={handleSignOutConfirm}>
                Sim, quero sair <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="tertiary" id="modal-cancel-btn" onClick={() => setShowSignoutModal(false)}>
                Voltar ao painel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Help / SOS Modal */}
      {showHelpModal && (
        <div className="modal-overlay active" role="dialog" aria-modal="true" aria-labelledby="help-heading">
          <div className="modal-box">
            <PhoneCall className="w-12 h-12 text-[#0f62fe] mx-auto mb-4" aria-hidden="true" />
            <h3 id="help-heading">Central de Ajuda SeniorEase</h3>
            <p className="mb-6">Você não está sozinho! Nossa equipe de suporte para a terceira idade está pronta para ajudar.</p>
            <div className="modal-actions">
              <Button variant="primary" onClick={() => { setShowHelpModal(false); alert("Chamando suporte telefônico 0800 700 8000..."); }}>
                📞 Ligar para Suporte (0800 700 8000)
              </Button>
              <Button variant="tertiary" onClick={() => setShowHelpModal(false)}>
                Fechar Ajuda
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
