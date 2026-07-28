import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { X, Volume2, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import {
  DictationTourIllustration,
  A11yScaleTourIllustration,
  PriorityTaskTourIllustration,
  CaregiverSupportTourIllustration,
} from "./TourIllustrationSVGs";

interface TourStepConfig {
  targetName: string;
  title: string;
  description: string;
  voiceText: string;
  tip: string;
  illustration: (colors: MobileThemeColors) => React.ReactNode;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    targetName: "Visão Geral do Painel",
    title: "👋 Bem-vindo ao SeniorEase Mobile",
    description: "Sua rotina acadêmica e pessoal organizada de forma simples, inclusiva e acessível na palma da sua mão.",
    voiceText: "Bem-vindo ao SeniorEase Mobile. Sua rotina acadêmica simples e inclusiva.",
    tip: "Acesse o painel para verificar suas tarefas diárias.",
    illustration: (c) => <DictationTourIllustration colors={c} />,
  },
  {
    targetName: "Atividade Prioritária",
    title: "🎯 Atividade de Alta Prioridade",
    description: "Exibe sua tarefa mais urgente do dia em destaque para ser concluída com apenas um toque no cartão.",
    voiceText: "Esta é sua atividade de maior prioridade no momento. Conclua com um toque.",
    tip: "Toque no cartão para marcar a atividade como concluída.",
    illustration: (c) => <PriorityTaskTourIllustration colors={c} />,
  },
  {
    targetName: "Acessibilidade Flutuante",
    title: "🔍 Ferramentas de Acessibilidade",
    description: "O botão lateral 'Acessível' permite ajustar o tamanho da fonte (A+/A-) e alternar para Alto Contraste (WCAG AAA) ou Modo Escuro.",
    voiceText: "Use a barra lateral de acessibilidade para personalizar fontes e cores.",
    tip: "O menu flutuante fica sempre disponível no lado da tela.",
    illustration: (c) => <A11yScaleTourIllustration colors={c} />,
  },
  {
    targetName: "Suporte & Cuidador",
    title: "🤝 Apoio & Cuidador Cadastrado",
    description: "Cadastre informações do seu cuidador para suporte rápido em caso de dúvidas ou apoio de emergência.",
    voiceText: "Cadastre dados do seu cuidador para apoio em caso de dúvidas.",
    tip: "Caso precise de apoio humano, consulte os contatos cadastrados.",
    illustration: (c) => <CaregiverSupportTourIllustration colors={c} />,
  },
];

interface InteractiveTourMobileProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  speakText?: (text: string) => void;
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
    }
  }, [visible]);

  if (!visible) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
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
              Passo {currentStepIndex + 1} de {TOUR_STEPS.length}
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
                <Text style={[styles.audioBtnText, { color: colors.primary, fontSize: Math.round(14 * fontScale) }]}>
                  Ouvir Passo em Voz Alta
                </Text>
              </TouchableOpacity>
            )}

            <View style={[styles.tipCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <Text style={[styles.tipText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
                💡 <Text style={{ fontWeight: "bold" }}>Dica:</Text> {currentStep.tip}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footerRow}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.surfaceSubtle }]}
                onPress={handlePrev}
              >
                <ArrowLeft size={18} color={colors.text} />
                <Text style={[styles.navBtnText, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                  Anterior
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholderBtn} />
            )}

            <TouchableOpacity
              style={[styles.navBtn, styles.primaryNavBtn, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.primaryNavBtnText, { color: colors.primaryContrast, fontSize: Math.round(14 * fontScale) }]}>
                {currentStepIndex === TOUR_STEPS.length - 1 ? "Concluir" : "Próximo"}
              </Text>
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <Check size={18} color={colors.primaryContrast} />
              ) : (
                <ArrowRight size={18} color={colors.primaryContrast} />
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
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  closeBtn: {
    padding: 4,
  },
  bodyScroll: {
    alignItems: "center",
    gap: 14,
    paddingBottom: 10,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  audioBtnText: {
    fontWeight: "bold",
  },
  tipCard: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  tipText: {
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 12,
  },
  placeholderBtn: {
    flex: 1,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 48,
    borderRadius: 8,
  },
  navBtnText: {
    fontWeight: "bold",
  },
  primaryNavBtn: {
    elevation: 2,
  },
  primaryNavBtnText: {
    fontWeight: "bold",
  },
});
