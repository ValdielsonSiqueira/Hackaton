import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Volume2, 
  X, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react-native";

export interface TourStep {
  targetName: string;
  title: string;
  description: string;
  voiceText: string;
  tip: string;
}

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    targetName: "Banner Principal",
    title: "1/5 Bem-vindo ao SeniorEase!",
    description: "Sua plataforma de aprendizado adaptada para estudantes seniores com foco em usabilidade, áudio e legibilidade.",
    voiceText: "Bem-vindo ao SeniorEase! Aqui fica o seu resumo diário.",
    tip: "Toque em 'Ouvir resumo do dia' para escutar suas tarefas em áudio.",
  },
  {
    targetName: "Atividade Prioritária",
    title: "2/5 Atividade de Alta Prioridade",
    description: "Exibe sua tarefa mais urgente do dia em destaque para ser concluída com apenas 1 toque.",
    voiceText: "Esta é sua atividade de maior prioridade no momento.",
    tip: "Clique em 'Marcar como Concluída' assim que finalizar.",
  },
  {
    targetName: "Acessibilidade Flutuante",
    title: "3/5 Ferramentas de Acessibilidade",
    description: "O botão lateral 'Acessível' permite ajustar fontes (A+/A-) e alternar entre Alto Contraste (WCAG AAA) ou Modo Escuro.",
    voiceText: "Use a barra lateral de acessibilidade para personalizar o tamanho do texto e as cores.",
    tip: "O menu fica disponível no lado direito de qualquer tela.",
  },
  {
    targetName: "Módulos de Acesso",
    title: "4/5 Módulos de Navegação Rápida",
    description: "Acesse as telas de Atividades, Perfil Acadêmico e a Central de Ajuda 0800 com atalhos diretos.",
    voiceText: "Nesta área você acessa os módulos principais.",
    tip: "Disque 0800 gratuitamente se precisar de apoio humano.",
  },
  {
    targetName: "Histórico de Atividades",
    title: "5/5 Síntese de Voz nas Atividades",
    description: "Acompanhe todas as suas tarefas com badges de status (✓ Feito / ⏳ Pendente) e botão de áudio individual.",
    voiceText: "Toque no ícone de alto-falante para ouvir o nome de cada atividade.",
    tip: "Toque no alto-falante para escutar qualquer atividade.",
  },
];

interface InteractiveTourMobileProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  speakText: (text: string) => void;
}

export const InteractiveTourMobile: React.FC<InteractiveTourMobileProps> = ({
  visible,
  theme,
  onClose,
  speakText,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { colors, fontScale } = theme;

  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
      speakText(DASHBOARD_TOUR_STEPS[0].voiceText);
    }
  }, [visible]);

  if (!visible) return null;

  const currentStep = DASHBOARD_TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DASHBOARD_TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      speakText(DASHBOARD_TOUR_STEPS[nextIdx].voiceText);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      speakText(DASHBOARD_TOUR_STEPS[prevIdx].voiceText);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: colors.borderWidth }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.tourBadge, { backgroundColor: colors.primary }]}>
              <Sparkles size={14} color={colors.primaryContrast} />
              <Text style={[styles.tourBadgeText, { color: colors.primaryContrast }]}>TOUR GUIADO (DRIVER MOBILE)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Highlight Target Indicator */}
          <View style={[styles.targetBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <Text style={[styles.targetNameText, { color: colors.primary }]}>
              📍 Destaque: {currentStep.targetName}
            </Text>
          </View>

          {/* Content */}
          <Text style={[styles.stepTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            {currentStep.title}
          </Text>

          <Text style={[styles.stepDesc, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            {currentStep.description}
          </Text>

          {/* Voice Speech Trigger */}
          <TouchableOpacity
            style={[styles.audioBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
            onPress={() => speakText(currentStep.voiceText)}
          >
            <Volume2 size={18} color={colors.primary} />
            <Text style={[styles.audioBtnText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
              Ouvir explicação em áudio
            </Text>
          </TouchableOpacity>

          {/* Tip Box */}
          <View style={[styles.tipBox, { backgroundColor: colors.surfaceSubtle, borderLeftColor: colors.primary }]}>
            <Text style={[styles.tipText, { color: colors.text, fontSize: Math.round(12 * fontScale) }]}>
              💡 <Text style={{ fontWeight: "bold" }}>Dica:</Text> {currentStep.tip}
            </Text>
          </View>

          {/* Progress Dots */}
          <View style={styles.dotsRow}>
            {DASHBOARD_TOUR_STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: idx === currentStepIndex ? colors.primary : colors.surfaceSubtle },
                ]}
              />
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity style={[styles.prevBtn, { borderColor: colors.border }]} onPress={handlePrev}>
                <ChevronLeft size={18} color={colors.text} />
                <Text style={[styles.prevBtnText, { color: colors.text }]}>Anterior</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}

            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
              <Text style={[styles.nextBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
                {currentStepIndex === DASHBOARD_TOUR_STEPS.length - 1 ? "Concluir" : "Próximo"}
              </Text>
              {currentStepIndex === DASHBOARD_TOUR_STEPS.length - 1 ? (
                <Check size={18} color={colors.primaryContrast} />
              ) : (
                <ChevronRight size={18} color={colors.primaryContrast} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    padding: 20,
    borderRadius: 0,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tourBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
  },
  tourBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  targetBox: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 0,
  },
  targetNameText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  stepTitle: {
    fontWeight: "bold",
  },
  stepDesc: {
    lineHeight: 20,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 0,
  },
  audioBtnText: {
    fontWeight: "bold",
  },
  tipBox: {
    padding: 10,
    borderLeftWidth: 4,
    borderRadius: 0,
  },
  tipText: {},
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 4,
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 0,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  prevBtn: {
    flex: 1,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 0,
  },
  prevBtnText: {
    fontWeight: "bold",
  },
  nextBtn: {
    flex: 1.5,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 0,
  },
  nextBtnText: {
    fontWeight: "bold",
  },
});
