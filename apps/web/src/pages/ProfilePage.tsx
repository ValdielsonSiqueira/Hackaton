import React, { useState } from "react";
import { TopNav } from "../components/layout/TopNav";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { profileSchema } from "../schemas/forms";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { 
  User, 
  Mail, 
  Eye, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  Bell,
  HeartHandshake,
  CheckCircle2,
  Save,
  Volume2,
  ZoomIn,
  Sun,
  Moon,
  RotateCcw,
  Compass
} from "lucide-react";
import { startProfileTour } from "../utils/tour";

export const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile, settings, updateSettings } = useApp();

  const [nameInput, setNameInput] = useState(userProfile.name);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [caregiverContact, setCaregiverContact] = useState(userProfile.caregiverContact);

  // Preferences & Accessibility states synced with AppContext & localStorage
  const fontScale = settings.fontScale || 1.0;
  const contrastMode = settings.contrastMode || "standard";

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

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

  const [nameErrorMsg, setNameErrorMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  const handleResetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
    triggerToast("Todas as preferências foram resetadas para o padrão!");
  };

  const handleSaveProfile = () => {
    setNameErrorMsg(null);
    setEmailErrorMsg(null);

    const result = profileSchema.safeParse({
      name: nameInput,
      email: emailInput,
      caregiverContact,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors.name?.[0]) setNameErrorMsg(fieldErrors.name[0]);
      if (fieldErrors.email?.[0]) setEmailErrorMsg(fieldErrors.email[0]);
      triggerToast("⚠️ Por favor, corrija os campos indicados");
      return;
    }

    updateUserProfile({
      name: result.data.name,
      email: result.data.email,
      caregiverContact: result.data.caregiverContact || "",
    });
    triggerToast("Informações do perfil salvas com sucesso!");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <main className="main-content" role="main">
        <div className="section-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">Suas Informações e Preferências</h2>
          <Button
            variant="tertiary"
            onClick={() => startProfileTour()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm h-10 min-h-[40px] px-3 border-[var(--hairline)] text-[var(--ink)] hover:bg-[var(--surface-1)]"
            title="Ver Tour Guiado do Perfil"
            aria-label="Ver Tour Guiado do Perfil"
          >
            <Compass className="w-4 h-4 text-[var(--primary)]" /> Tour Guiado
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1040px] mx-auto mb-8">
          {/* Column 1 & 2: Personal Info & Preferences */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Card 1: Personal Data */}
            <Card className="login-card p-6" id="user-profile-card">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0f62fe] text-white flex items-center justify-center text-2xl font-semibold shrink-0">
                    {(nameInput || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-normal">{nameInput || "Estudante"}</CardTitle>
                    <CardDescription className="text-[#525252]">Estudante SeniorEase — FIAP Inclusive</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className={`form-group ${nameErrorMsg ? "error" : ""}`} id="fg-user-name">
                  <label htmlFor="user-name-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
                    <User className="w-4 h-4 text-[var(--primary)]" /> Seu Nome Completo
                  </label>
                  <Input
                    id="user-name-input"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (nameErrorMsg) setNameErrorMsg(null);
                    }}
                    placeholder="Seu nome completo"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(nameErrorMsg)}
                    aria-describedby={nameErrorMsg ? "name-error-msg" : undefined}
                  />
                  {!nameErrorMsg && <p className="form-helper">Como deseja ser chamado no sistema</p>}
                  {nameErrorMsg && <p className="form-error-msg" id="name-error-msg" role="alert">{nameErrorMsg}</p>}
                </div>

                <div className={`form-group ${emailErrorMsg ? "error" : ""}`} id="fg-user-email">
                  <label htmlFor="user-email-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
                    <Mail className="w-4 h-4 text-[var(--primary)]" /> Seu E-mail
                  </label>
                  <Input
                    id="user-email-input"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (emailErrorMsg) setEmailErrorMsg(null);
                    }}
                    placeholder="seu.email@exemplo.com"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(emailErrorMsg)}
                    aria-describedby={emailErrorMsg ? "email-error-msg" : undefined}
                  />
                  {!emailErrorMsg && <p className="form-helper">Seu e-mail de acesso e notificações</p>}
                  {emailErrorMsg && <p className="form-error-msg" id="email-error-msg" role="alert">{emailErrorMsg}</p>}
                </div>

                <div className="form-group pt-2">
                  <label htmlFor="caregiver-input" className="flex items-center gap-2 mb-2 font-semibold text-[var(--ink)]">
                    <HeartHandshake className="w-4 h-4 text-[var(--primary)]" /> E-mail ou Telefone do Cuidador / Familiar (Opcional)
                  </label>
                  <Input
                    id="caregiver-input"
                    value={caregiverContact}
                    onChange={(e) => setCaregiverContact(e.target.value)}
                    placeholder="Ex: Maria (Filha) - (11) 99999-8888"
                  />
                  <p className="form-helper">Usado apenas para cópia de lembretes e apoio de emergência (deixe em branco se não houver).</p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSaveProfile}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Salvar Informações Cadastrais
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Accessibility Preferences Controls */}
            <Card className="login-card p-4 sm:p-6 w-full min-w-0 overflow-hidden" id="accessibility-preferences-card">
              <CardHeader className="p-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-normal flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[var(--primary)] shrink-0" /> Preferências de Acessibilidade Salvas
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-[var(--ink-muted)]">Ajuste como o SeniorEase se comporta para você</CardDescription>
                </div>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={handleResetAll}
                  className="h-9 text-xs px-3 border-[#da1e28] text-[#da1e28] hover:bg-[#fff0f0] flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resetar
                </Button>
              </CardHeader>

              <CardContent className="p-0 space-y-4 sm:space-y-5">
                {/* 1. Font Size */}
                <div className="p-3.5 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-sm min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <ZoomIn className="w-6 h-6 text-[var(--primary)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base text-[var(--ink)] truncate">Tamanho do Texto da Plataforma</div>
                      <div className="text-xs text-[var(--ink-muted)]">Aumente ou diminua as letras da tela</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full max-w-full overflow-hidden">
                    <div className="text-sm font-bold text-[var(--ink)] text-center py-2 px-3 bg-[var(--surface-1)] border border-[var(--hairline)] w-full rounded-sm">
                      Tamanho Atual: {Math.round(fontScale * 100)}%
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => changeFontScale(0.1)}
                      className="w-full h-auto min-h-[44px] py-2 px-3 font-bold text-sm flex items-center justify-center gap-1.5 leading-tight"
                      title="Aumentar texto"
                    >
                      A+ Aumentar
                    </Button>
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => changeFontScale(-0.1)}
                      className="w-full h-auto min-h-[44px] py-2 px-3 font-bold text-sm flex items-center justify-center gap-1.5 leading-tight"
                      title="Diminuir texto"
                    >
                      A- Diminuir
                    </Button>
                  </div>
                </div>

                {/* 2. Contrast Modes */}
                <div className="p-3.5 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-sm min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-6 h-6 text-[var(--primary)] shrink-0" />
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-[var(--ink)]">Modo de Contraste e Tema Visual</div>
                      <div className="text-xs text-[var(--ink-muted)]">Escolha a paleta mais confortável para sua visão</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full max-w-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => applyContrast("standard")}
                      className={`w-full h-auto min-h-[44px] py-2 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight ${
                        contrastMode === "standard" 
                          ? "bg-[#0f62fe] text-white border-[#0f62fe]" 
                          : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
                      }`}
                    >
                      <Sun className="w-4 h-4 shrink-0" /> Padrão (Branco)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContrast("high")}
                      className={`w-full h-auto min-h-[44px] py-2 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight ${
                        contrastMode === "high" 
                          ? "bg-[#000000] text-white border-[#000000]" 
                          : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
                      }`}
                    >
                      <Eye className="w-4 h-4 shrink-0" /> Alto Contraste
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContrast("dark")}
                      className={`w-full h-auto min-h-[44px] py-2 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight ${
                        contrastMode === "dark" 
                          ? "bg-[#161616] text-[#f1c21b] border-[#161616]" 
                          : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
                      }`}
                    >
                      <Moon className="w-4 h-4 shrink-0" /> Modo Escuro
                    </button>
                  </div>
                </div>

                {/* 3. Confirm Actions */}
                <div className="flex flex-row items-center justify-between gap-3 p-3.5 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-sm min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <ShieldCheck className="w-6 h-6 text-[#24a148] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base text-[var(--ink)]">Confirmação de Ações Críticas</div>
                      <div className="text-xs text-[var(--ink-muted)]">Pede confirmação antes de excluir tarefas ou sair</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Switch
                      checked={settings.criticalConfirmation ?? true}
                      onCheckedChange={async (checked) => {
                        await updateSettings({ ...settings, criticalConfirmation: checked });
                        triggerToast(checked ? "Confirmação de ações críticas ativada" : "Confirmações desativadas");
                      }}
                    />
                  </div>
                </div>

                {/* 4. Voice & Visual Feedback */}
                <div className="flex flex-row items-center justify-between gap-3 p-3.5 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-sm min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Volume2 className="w-6 h-6 text-[var(--primary)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base text-[var(--ink)]">Feedback Visual e Sonoro Reforçado</div>
                      <div className="text-xs text-[var(--ink-muted)]">Ativa animações festivas e sintetizador de voz nativo</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Switch
                      checked={settings.feedbackVisual ?? true}
                      onCheckedChange={async (checked) => {
                        await updateSettings({ ...settings, feedbackVisual: checked });
                        triggerToast(checked ? "Feedback reforçado ativado" : "Feedback reforçado desativado");
                      }}
                    />
                  </div>
                </div>

                {/* 5. Simplified Mode */}
                <div className="flex flex-row items-center justify-between gap-3 p-3.5 sm:p-4 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-sm min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Bell className="w-6 h-6 text-[#f1c21b] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base text-[var(--ink)]">Modo de Navegação Simplificado</div>
                      <div className="text-xs text-[var(--ink-muted)]">Oculta distrações secundárias para foco máximo</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Switch
                      checked={settings.navigationMode === "simplified"}
                      onCheckedChange={async (checked) => {
                        const newMode = checked ? "simplified" : "standard";
                        await updateSettings({ ...settings, navigationMode: newMode });
                        triggerToast(checked ? "Modo de Navegação Simplificado ativado" : "Modo de Navegação Padrão ativado");
                      }}
                    />
                  </div>
                </div>

                <Button variant="primary" onClick={handleSaveProfile} className="w-full mt-4 flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> Salvar Todas as Minhas Preferências
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Persistence Badge & Quick Links */}
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
        </div>
      </main>

      {/* Toast */}
      {toastMsg && (
        <div className="toast show" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
