import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { Sparkles, ArrowRight, Check, X } from "lucide-react-native";

interface GuidedTourStep {
  title: string;
  description: string;
}

const TOUR_STEPS: GuidedTourStep[] = [
  {
    title: "1/3 Bem-vindo ao SeniorEase Mobile!",
    description: "Sua plataforma inclusiva de estudos acadêmicos adaptada para fácil leitura, navegação guiada e síntese por voz.",
  },
  {
    title: "2/3 Acessibilidade em 1 Toque",
    description: "Toque no botão lateral verde 'Acessível' para ajustar o tamanho das fontes (A+/A-) e alternar entre Alto Contraste (WCAG AAA) ou Modo Escuro.",
  },
  {
    title: "3/3 Atividades e Passos Guiados",
    description: "Crie novas tarefas com prioridades em cores nítidas e siga os passos guiados para organizar seu aprendizado sem estresse.",
  },
];

interface GuidedTourMobileProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onFinishTour: () => void;
  speakText: (text: string) => void;
}

export const GuidedTourMobile: React.FC<GuidedTourMobileProps> = ({
  visible,
  theme,
  onFinishTour,
  speakText,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { colors, fontScale } = theme;

  if (!visible) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      speakText(TOUR_STEPS[nextIdx].description);
    } else {
      onFinishTour();
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onFinishTour}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 2 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onFinishTour}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
            <Sparkles size={16} color={colors.primaryContrast} />
            <Text style={[styles.stepBadgeText, { color: colors.primaryContrast }]}>TOUR GUIADO</Text>
          </View>

          <Text style={[styles.stepTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            {currentStep.title}
          </Text>

          <Text style={[styles.stepDesc, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            {currentStep.description}
          </Text>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {TOUR_STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: idx === currentStepIndex ? colors.primary : colors.surfaceSubtle },
                ]}
              />
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
              <Text style={[styles.nextBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
                {currentStepIndex === TOUR_STEPS.length - 1 ? "Concluir Tour" : "Próximo Passo"}
              </Text>
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <Check size={18} color={colors.primaryContrast} />
              ) : (
                <ArrowRight size={18} color={colors.primaryContrast} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={onFinishTour}>
              <Text style={[styles.skipBtnText, { color: colors.textMuted }]}>Pular Apresentação</Text>
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
    padding: 24,
    borderRadius: 0,
    gap: 12,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
  },
  stepBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  stepTitle: {
    fontWeight: "bold",
  },
  stepDesc: {
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 4,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 0,
  },
  actionRow: {
    gap: 10,
    marginTop: 8,
  },
  nextBtn: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 0,
  },
  nextBtnText: {
    fontWeight: "bold",
  },
  skipBtn: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
