import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { 
  Sliders, 
  RotateCcw, 
  ZoomIn, 
  Eye, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Volume2, 
  Bell, 
  Save 
} from "lucide-react";
import type { UserSettings } from "@seniorease/core";

interface AccessibilityPreferencesFormProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  onTriggerToast: (msg: string) => void;
  onSaveAll: () => void;
}

export const AccessibilityPreferencesForm: React.FC<AccessibilityPreferencesFormProps> = ({
  settings,
  updateSettings,
  onTriggerToast,
  onSaveAll,
}) => {
  const fontScale = settings.fontScale || 1.0;
  const contrastMode = settings.contrastMode || "standard";

  const changeFontScale = async (delta: number) => {
    const newScale = Math.max(0.8, Math.min(1.5, +(fontScale + delta).toFixed(1)));
    await updateSettings({ ...settings, fontScale: newScale });
    onTriggerToast(`Tamanho do texto: ${Math.round(newScale * 100)}%`);
  };

  const applyContrast = async (mode: "standard" | "high" | "dark") => {
    await updateSettings({ ...settings, contrastMode: mode });
    if (mode === "high") {
      onTriggerToast("Alto contraste ativado");
    } else if (mode === "dark") {
      onTriggerToast("Modo escuro ativado");
    } else {
      onTriggerToast("Contraste padrão redefinido");
    }
  };

  const handleResetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
    onTriggerToast("Todas as preferências foram resetadas para o padrão!");
  };

  return (
    <Card className="bg-[var(--canvas)] border border-[var(--hairline)] p-5 sm:p-8 w-full min-w-0 overflow-hidden rounded-xl shadow-xs" id="accessibility-preferences-card">
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
                onTriggerToast(checked ? "Confirmação de ações críticas ativada" : "Confirmações desativadas");
              }}
            />
          </div>
        </div>

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
                onTriggerToast(checked ? "Feedback reforçado ativado" : "Feedback reforçado desativado");
              }}
            />
          </div>
        </div>

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
                onTriggerToast(checked ? "Modo de Navegação Simplificado ativado" : "Modo de Navegação Padrão ativado");
              }}
            />
          </div>
        </div>

        <Button variant="primary" onClick={onSaveAll} className="w-full mt-4 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Salvar Todas as Minhas Preferências
        </Button>
      </CardContent>
    </Card>
  );
};
