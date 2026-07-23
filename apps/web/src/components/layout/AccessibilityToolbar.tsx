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
      className="fixed right-0 top-[68px] z-[9999] flex flex-col items-end gap-[8px] a11y-toolbar-fixed"
      aria-label="Painel Flutuante de Acessibilidade"
    >
      {/* VLibras Widget (Above Toolbar) */}
      <VLibras />

      <div className="flex items-start">
        {/* Sidebar Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#24a148] hover:bg-[#198038] text-white p-[12px] rounded-l-md shadow-2xl flex flex-col items-center gap-[4px] cursor-pointer transition-transform hover:scale-105 border-0 focus-visible:outline-2 focus-visible:outline-[#0f62fe]"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar ferramentas de acessibilidade" : "Abrir ferramentas de acessibilidade"}
          title="Acessibilidade"
        >
          <Accessibility className="w-[32px] h-[32px] text-white" />
          <span className="text-[10px] leading-[12px] font-bold tracking-wider uppercase text-white">Acessível</span>
          {isOpen ? <ChevronRight className="w-[16px] h-[16px] text-white mt-[4px]" /> : <ChevronLeft className="w-[16px] h-[16px] text-white mt-[4px]" />}
        </button>

        {/* Drawer Panel */}
        {isOpen && (
          <div className="bg-white border-2 border-[#24a148] shadow-2xl w-[290px] p-[8px] rounded-l-lg flex flex-col gap-[4px] text-[#161616] font-sans">
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
