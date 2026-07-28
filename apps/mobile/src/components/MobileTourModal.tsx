import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { X, Volume2, ArrowRight, ArrowLeft, Check } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import {
  DictationTourIllustration,
  A11yScaleTourIllustration,
  PriorityTaskTourIllustration,
  CaregiverSupportTourIllustration,
} from "./TourIllustrationSVGs";

interface TourStep {
  title: string;
  description: string;
  illustration: (colors: MobileThemeColors) => React.ReactNode;
}

interface MobileTourModalProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  speakText?: (text: string) => void;
}

const TOUR_STORAGE_KEY = "seniorease_tour_completed";

export const markMobileTourCompleted = async () => {
  try {
    await AsyncStorage.setItem(TOUR_STORAGE_KEY, "true");
  } catch (e) {}
};

export const isMobileTourCompleted = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(TOUR_STORAGE_KEY);
    return val === "true";
  } catch (e) {
    return false;
  }
};

export const MobileTourModal: React.FC<MobileTourModalProps> = ({
  visible,
  theme,
  onClose,
  speakText,
}) => {
  const { colors, fontScale } = theme;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      title: "👋 Bem-vindo ao SeniorEase Mobile",
      description: "Sua rotina acadêmica e pessoal simples, inclusiva e acessível na palma da sua mão.",
      illustration: (c) => <DictationTourIllustration colors={c} />,
    },
    {
      title: "🔍 Controle de Fonte & Contraste",
      description: "Ajuste o tamanho das letras (A- / A+) e alterne para Alto Contraste a qualquer momento.",
      illustration: (c) => <A11yScaleTourIllustration colors={c} />,
    },
    {
      title: "🎯 Tarefas Prioritárias & Voz",
      description: "Veja seus compromissos urgentes e ouça a leitura em voz alta com apenas um toque.",
      illustration: (c) => <PriorityTaskTourIllustration colors={c} />,
    },
    {
      title: "🤝 Apoio & Cuidador",
      description: "Cadastre dados do seu cuidador para suporte rápido em caso de dúvidas ou emergências.",
      illustration: (c) => <CaregiverSupportTourIllustration colors={c} />,
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      await markMobileTourCompleted();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSpeakCurrentStep = () => {
    if (speakText && currentStep) {
      speakText(`${currentStep.title}. ${currentStep.description}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              Passo {currentStepIndex + 1} de {steps.length}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Fechar tour">
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
              {currentStep.title}
            </Text>

            {currentStep.illustration(colors)}

            <Text
              style={[
                styles.description,
                { color: colors.textMuted, fontSize: Math.round(15 * fontScale) },
              ]}
            >
              {currentStep.description}
            </Text>

            {speakText && (
              <TouchableOpacity
                style={[styles.audioBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handleSpeakCurrentStep}
                accessibilityLabel="Ouvir instrução do tour"
              >
                <Volume2 size={20} color={colors.primary} />
                <Text style={[styles.audioBtnText, { color: colors.primary }]}>Ouvir Passo em Voz Alta</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View style={styles.footerRow}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handlePrev}
              >
                <ArrowLeft size={18} color={colors.text} />
                <Text style={[styles.navBtnText, { color: colors.text }]}>Anterior</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={styles.nextBtnText}>
                {currentStepIndex === steps.length - 1 ? "Concluir" : "Próximo"}
              </Text>
              {currentStepIndex === steps.length - 1 ? (
                <Check size={18} color="#FFFFFF" />
              ) : (
                <ArrowRight size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  closeBtn: {
    padding: 4,
  },
  bodyScroll: {
    paddingVertical: 8,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
    marginVertical: 10,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  audioBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
