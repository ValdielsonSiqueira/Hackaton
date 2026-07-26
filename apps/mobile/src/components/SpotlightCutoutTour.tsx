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
  Volume2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check 
} from "lucide-react-native";

export interface SpotlightStep {
  id: string;
  targetName: string;
  title: string;
  description: string;
  voiceText: string;
  tip: string;
  scrollY: number;
}

interface SpotlightCutoutTourProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  steps: SpotlightStep[];
  onClose: () => void;
  speakText: (text: string) => void;
  onStepChange?: (stepIndex: number, scrollY: number) => void;
}

export const SpotlightCutoutTour: React.FC<SpotlightCutoutTourProps> = ({
  visible,
  theme,
  steps,
  onClose,
  speakText,
  onStepChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { colors, fontScale } = theme;

  useEffect(() => {
    if (visible && steps.length > 0) {
      setCurrentStepIndex(0);
      speakText(steps[0].voiceText);
      if (onStepChange) {
        onStepChange(0, steps[0].scrollY);
      }
    }
  }, [visible, steps]);

  if (!visible || steps.length === 0) return null;

  const step = steps[currentStepIndex];

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    speakText(steps[index].voiceText);
    if (onStepChange) {
      onStepChange(index, steps[index].scrollY);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.popoverCard, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: colors.borderWidth }]}>
          {/* Header Tag */}
          <View style={styles.popoverHeader}>
            <View style={[styles.tagBadge, { backgroundColor: colors.primary }]}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.tagBadgeText}>CONHEÇA A PLATAFORMA</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Section Indicator */}
          <View style={[styles.targetLabelBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.targetLabelText, { color: colors.primary }]}>
              📍 Apontando para: {step.targetName}
            </Text>
          </View>

          <Text style={[styles.stepTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            {step.title}
          </Text>

          <Text style={[styles.stepDesc, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            {step.description}
          </Text>

          {/* Audio Speech Button */}
          <TouchableOpacity
            style={[styles.voiceBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
            onPress={() => speakText(step.voiceText)}
          >
            <Volume2 size={18} color={colors.primary} />
            <Text style={[styles.voiceBtnText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
              Ouvir explicação por voz
            </Text>
          </TouchableOpacity>

          {/* Tip Box */}
          <View style={[styles.tipBox, { backgroundColor: colors.surfaceSubtle, borderLeftColor: colors.primary }]}>
            <Text style={[styles.tipText, { color: colors.text, fontSize: Math.round(12 * fontScale) }]}>
              💡 <Text style={{ fontWeight: "bold" }}>Dica:</Text> {step.tip}
            </Text>
          </View>

          {/* Dots Progress */}
          <View style={styles.dotsRow}>
            {steps.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: idx === currentStepIndex ? colors.primary : colors.surfaceSubtle },
                ]}
              />
            ))}
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity style={[styles.prevBtn, { borderColor: colors.border }]} onPress={handlePrev}>
                <ChevronLeft size={18} color={colors.text} />
                <Text style={[styles.prevBtnText, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>Anterior</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}

            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
              <Text style={[styles.nextBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
                {currentStepIndex === steps.length - 1 ? "Concluir" : "Próximo"}
              </Text>
              {currentStepIndex === steps.length - 1 ? (
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
  popoverCard: {
    padding: 20,
    borderRadius: 0,
    gap: 12,
    elevation: 12,
  },
  popoverHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
  },
  tagBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  targetLabelBox: {
    padding: 8,
    borderRadius: 0,
  },
  targetLabelText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  stepTitle: {
    fontWeight: "bold",
  },
  stepDesc: {
    lineHeight: 20,
  },
  voiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 0,
  },
  voiceBtnText: {
    fontWeight: "bold",
  },
  tipBox: {
    padding: 10,
    borderLeftWidth: 4,
    borderRadius: 0,
  },
  tipText: {
    lineHeight: 16,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 2,
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 0,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  prevBtn: {
    flex: 1,
    minHeight: 52,
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
    minHeight: 52,
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
