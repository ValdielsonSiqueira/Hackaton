import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { 
  Settings, 
  RotateCcw, 
  ZoomIn, 
  Eye, 
  ShieldCheck, 
  Sun, 
  Moon 
} from "lucide-react";
import type { UserSettings } from "@seniorease/core";

interface QuickSettingsCardProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  onTriggerToast: (msg: string) => void;
}

export const QuickSettingsCard: React.FC<QuickSettingsCardProps> = ({
  settings,
  updateSettings,
  onTriggerToast,
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
    <Card className="bg-[var(--canvas)] border border-[var(--hairline)] p-5 sm:p-6 mb-8 rounded-xl shadow-xs overflow-hidden w-full max-w-full box-border" role="region" aria-labelledby="qs-heading">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-[var(--hairline)]">
        <h3 className="text-base font-semibold text-[var(--ink)] flex items-center gap-2 mb-0" id="qs-heading">
          <Settings className="w-5 h-5 text-[var(--primary)] shrink-0" /> Preferências Rápidas de Acessibilidade
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full box-border">
        <div className="p-4 bg-[var(--surface-1)] border border-[var(--hairline)] flex flex-col justify-between gap-3 min-w-0 w-full rounded-lg box-border overflow-hidden">
          <div>
            <label className="text-base font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
              <ZoomIn className="w-5 h-5 text-[var(--primary)] shrink-0" /> Tamanho do Texto
            </label>
            <p className="text-xs text-[var(--ink-muted)] mb-3 leading-relaxed break-words">Aumente ou diminua as letras da página</p>
          </div>
          <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full max-w-full overflow-hidden rounded-md box-border">
            <div className="text-sm font-bold text-[var(--ink)] text-center py-2 px-3 bg-[var(--surface-1)] border border-[var(--hairline)] w-full rounded-sm break-words">
              Tamanho Atual: {Math.round(fontScale * 100)}%
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => changeFontScale(0.1)}
              className="w-full h-auto min-h-[44px] py-2.5 px-3 font-bold text-sm flex items-center justify-center gap-1.5 leading-tight cursor-pointer"
              title="Aumentar texto"
            >
              A+ Aumentar
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => changeFontScale(-0.1)}
              className="w-full h-auto min-h-[44px] py-2.5 px-3 font-bold text-sm flex items-center justify-center gap-1.5 leading-tight cursor-pointer"
              title="Diminuir texto"
            >
              A- Diminuir
            </Button>
          </div>
        </div>

        <div className="p-4 bg-[var(--surface-1)] border border-[var(--hairline)] flex flex-col justify-between gap-3 min-w-0 w-full rounded-lg box-border overflow-hidden">
          <div>
            <label className="text-base font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
              <Eye className="w-5 h-5 text-[var(--primary)] shrink-0" /> Tema e Contraste
            </label>
            <p className="text-xs text-[var(--ink-muted)] mb-3 leading-relaxed break-words">Escolha a cor de fundo mais confortável</p>
          </div>
          <div className="flex flex-col gap-2 bg-[var(--canvas)] p-2.5 border border-[var(--hairline)] w-full max-w-full overflow-hidden rounded-md box-border">
            <button
              type="button"
              onClick={() => applyContrast("standard")}
              className={`w-full h-auto min-h-[44px] py-2.5 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight rounded-sm ${
                contrastMode === "standard" 
                  ? "bg-[#0f62fe] text-white border-[#0f62fe]" 
                  : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
              }`}
            >
              <Sun className="w-4 h-4 shrink-0" /> <span className="break-words">Padrão (Branco)</span>
            </button>
            <button
              type="button"
              onClick={() => applyContrast("high")}
              className={`w-full h-auto min-h-[44px] py-2.5 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight rounded-sm ${
                contrastMode === "high" 
                  ? "bg-[#000000] text-white border-[#000000]" 
                  : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" /> <span className="break-words">Alto Contraste</span>
            </button>
            <button
              type="button"
              onClick={() => applyContrast("dark")}
              className={`w-full h-auto min-h-[44px] py-2.5 px-3 font-bold text-sm border cursor-pointer transition-colors flex items-center justify-center gap-1.5 leading-tight rounded-sm ${
                contrastMode === "dark" 
                  ? "bg-[#161616] text-[#f1c21b] border-[#161616]" 
                  : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--surface-1)]"
              }`}
            >
              <Moon className="w-4 h-4 shrink-0" /> <span className="break-words">Modo Escuro</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[var(--surface-1)] border border-[var(--hairline)] flex flex-col justify-between gap-3 min-w-0 w-full rounded-lg box-border overflow-hidden">
          <div>
            <label className="text-base font-semibold text-[var(--ink)] flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#24a148] shrink-0" /> Proteções & Leitura
            </label>
            <p className="text-xs text-[var(--ink-muted)] mb-3 leading-relaxed break-words">Confirmações antes de ações e áudio</p>
          </div>
          <div className="flex flex-col gap-3 bg-[var(--canvas)] p-3 border border-[var(--hairline)] w-full max-w-full overflow-hidden rounded-md box-border">
            <div className="flex items-center justify-between gap-2 w-full max-w-full overflow-hidden pb-2.5 border-b border-[var(--hairline)] border-dashed">
              <label htmlFor="qs-confirm" className="text-xs sm:text-sm text-[var(--ink)] cursor-pointer font-medium leading-snug break-words flex-1 pr-1">Confirmar Ações</label>
              <Switch id="qs-confirm" className="shrink-0" defaultChecked onCheckedChange={(checked) => onTriggerToast(checked ? "Confirmação ativada" : "Desativada")} />
            </div>
            <div className="flex items-center justify-between gap-2 w-full max-w-full overflow-hidden pt-0.5">
              <label htmlFor="qs-voice" className="text-xs sm:text-sm text-[var(--ink)] cursor-pointer font-medium leading-snug break-words flex-1 pr-1">Lembretes por Voz</label>
              <Switch id="qs-voice" className="shrink-0" defaultChecked onCheckedChange={(checked) => onTriggerToast(checked ? "Voz ativada" : "Desativada")} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
