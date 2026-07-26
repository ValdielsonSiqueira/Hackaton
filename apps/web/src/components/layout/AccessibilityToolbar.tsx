import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { VLibras } from "./VLibras";
import { 
  Accessibility, 
  RotateCcw, 
  Sun, 
  Moon, 
  Eye, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export const AccessibilityToolbar: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const fontScale = settings.fontScale || 1.0;
  const contrast = settings.contrastMode || "standard";

  const changeFontScale = async (delta: number) => {
    const newScale = Math.max(0.8, Math.min(1.5, +(fontScale + delta).toFixed(1)));
    await updateSettings({ ...settings, fontScale: newScale });
  };

  const applyContrast = async (mode: "standard" | "high" | "dark") => {
    await updateSettings({ ...settings, contrastMode: mode });
  };

  const resetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
  };

  return (
    <aside 
      id="a11y-toolbar-floating"
      className="fixed right-0 top-[60px] sm:top-[68px] z-[9999] flex flex-col items-end gap-2 a11y-toolbar-fixed"
      aria-label="Painel Flutuante de Acessibilidade"
    >
      {/* VLibras Widget (Above Toolbar) */}
      <VLibras />

      <div className="flex items-start">
        {/* Sidebar Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#24a148] hover:bg-[#198038] text-white px-2 py-2 rounded-l-md shadow-xl flex flex-col items-center gap-0.5 cursor-pointer transition-transform hover:scale-105 border-0 focus-visible:outline-2 focus-visible:outline-[#0f62fe]"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar ferramentas de acessibilidade" : "Abrir ferramentas de acessibilidade"}
          title="Acessibilidade"
        >
          <Accessibility className="w-5 h-5 text-white" />
          <span className="text-[9px] leading-tight font-bold tracking-wider uppercase text-white">Acessível</span>
          {isOpen ? <ChevronRight className="w-3.5 h-3.5 text-white mt-0.5" /> : <ChevronLeft className="w-3.5 h-3.5 text-white mt-0.5" />}
        </button>

        {/* Drawer Panel */}
        {isOpen && (
          <div className="bg-[var(--canvas)] border-2 border-[#24a148] shadow-2xl w-[260px] sm:w-[290px] max-w-[calc(100vw-55px)] p-2 rounded-l-lg flex flex-col gap-1 text-[var(--ink)] font-sans">
            <div className="bg-[#24a148] text-white p-[12px] font-semibold text-[16px] leading-[20px] flex items-center justify-between">
              <span className="flex items-center gap-[8px]">
                <Accessibility className="w-[22px] h-[22px] text-white" /> Acessibilidade
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 border-0 bg-transparent cursor-pointer font-bold text-[18px] leading-[18px]"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Font Controls */}
            <button
              type="button"
              onClick={() => changeFontScale(0.1)}
              className="flex items-center justify-between p-[14px] bg-[#f4f4f4] hover:bg-[#e5edff] hover:text-[#0f62fe] text-[#161616] font-semibold text-[16px] leading-[20px] border-b border-[#e0e0e0] border-0 cursor-pointer transition-colors text-left"
            >
              <span>A+ Aumentar Fonte</span>
              <span className="text-[13px] leading-[16px] text-[#525252] font-normal">({Math.round(fontScale * 100)}%)</span>
            </button>

            <button
              type="button"
              onClick={() => changeFontScale(-0.1)}
              className="flex items-center justify-between p-[14px] bg-[#f4f4f4] hover:bg-[#e5edff] hover:text-[#0f62fe] text-[#161616] font-semibold text-[16px] leading-[20px] border-b border-[#e0e0e0] border-0 cursor-pointer transition-colors text-left"
            >
              <span>A- Diminuir Fonte</span>
              <span className="text-[13px] leading-[16px] text-[#525252] font-normal">({Math.round(fontScale * 100)}%)</span>
            </button>

            {/* Contrast Controls */}
            <button
              type="button"
              onClick={() => applyContrast("high")}
              className={`flex items-center justify-between p-[14px] font-semibold text-[16px] leading-[20px] border-b border-[#e0e0e0] border-0 cursor-pointer transition-colors text-left ${contrast === "high" ? "bg-[#000000] text-white" : "bg-[#f4f4f4] hover:bg-[#e0e0e0] text-[#161616]"}`}
            >
              <span className="flex items-center gap-[10px]">
                <Eye className="w-[18px] h-[18px]" /> Contraste Alto (Preto)
              </span>
            </button>

            <button
              type="button"
              onClick={() => applyContrast("dark")}
              className={`flex items-center justify-between p-[14px] font-semibold text-[16px] leading-[20px] border-b border-[#e0e0e0] border-0 cursor-pointer transition-colors text-left ${contrast === "dark" ? "bg-[#161616] text-[#f1c21b]" : "bg-[#f4f4f4] hover:bg-[#e0e0e0] text-[#161616]"}`}
            >
              <span className="flex items-center gap-[10px]">
                <Moon className="w-[18px] h-[18px]" /> Modo Escuro
              </span>
            </button>

            <button
              type="button"
              onClick={() => applyContrast("standard")}
              className={`flex items-center justify-between p-[14px] font-semibold text-[16px] leading-[20px] border-b border-[#e0e0e0] border-0 cursor-pointer transition-colors text-left ${contrast === "standard" ? "bg-[#e5edff] text-[#0f62fe]" : "bg-[#f4f4f4] hover:bg-[#e0e0e0] text-[#161616]"}`}
            >
              <span className="flex items-center gap-[10px]">
                <Sun className="w-[18px] h-[18px]" /> Contraste Padrão
              </span>
            </button>

            {/* Reset Control */}
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center justify-between p-[14px] bg-[#fff0f0] hover:bg-[#ffdada] text-[#da1e28] font-semibold text-[16px] leading-[20px] border-0 cursor-pointer transition-colors text-left mt-[4px]"
            >
              <span className="flex items-center gap-[10px]">
                <RotateCcw className="w-[18px] h-[18px]" /> Resetar Ajustes
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AccessibilityToolbar;
