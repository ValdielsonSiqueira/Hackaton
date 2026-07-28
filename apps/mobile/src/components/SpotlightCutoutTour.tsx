import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal,
  ScrollView
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { 
  Sparkles, 
  Volume2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  BookOpen,
  Flame,
  CheckCircle2,
  Eye,
  BookCheck,
  User,
  PhoneCall,
  Clock,
  Mic,
  Calendar,
  Target,
  Trash2,
  ShieldCheck,
  Circle,
  Plus
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

const TourIllustrationBox: React.FC<{ stepId: string; theme: { colors: MobileThemeColors; fontScale: number } }> = ({ stepId, theme }) => {
  const { colors } = theme;
  const isHighContrast = colors.mode === "high";
  const accentColor = isHighContrast ? colors.primary : "#0F62FE";

  switch (stepId) {
    case "step-1":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.illCircle, { backgroundColor: accentColor }]}>
              <BookOpen size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text }}>Banner Diário Acadêmico</Text>
              <View style={[styles.illPill, { backgroundColor: isHighContrast ? "#222" : "#E5EDFF", alignSelf: "flex-start" }]}>
                <Volume2 size={13} color={accentColor} />
                <Text style={{ fontSize: 11, fontWeight: "bold", color: accentColor }}>Ouvir resumo em voz alta</Text>
              </View>
            </View>
          </View>
        </View>
      );

    case "step-2":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border, borderLeftWidth: 5, borderLeftColor: "#DA1E28" }]}>
          <View style={styles.illRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Flame size={16} color="#DA1E28" />
                <Text style={{ fontSize: 11, fontWeight: "900", color: "#DA1E28", textTransform: "uppercase" }}>Prioridade Alta / Urgente</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text }}>Entregar Relatório de UX</Text>
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: "#198038" }]}>
              <CheckCircle2 size={22} color="#FFFFFF" />
            </View>
          </View>
        </View>
      );

    case "step-3":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.text }}>Controle Rápido de Leitura (A+ / A-)</Text>
            <View style={styles.illRow}>
              <View style={[styles.illButton, { backgroundColor: accentColor, flex: 1 }]}>
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 13 }}>A- Diminuir</Text>
              </View>
              <View style={[styles.illButton, { backgroundColor: accentColor, flex: 1 }]}>
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}>A+ Aumentar</Text>
              </View>
              <View style={[styles.illCircleSmall, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: 1 }]}>
                <Eye size={18} color={accentColor} />
              </View>
            </View>
          </View>
        </View>
      );

    case "step-4":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <BookCheck size={20} color={accentColor} />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>Atividades</Text>
            </View>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <User size={20} color="#8A3FFC" />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>Perfil</Text>
            </View>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <PhoneCall size={20} color="#198038" />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>0800 Suporte</Text>
            </View>
          </View>
        </View>
      );

    case "step-5":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border, gap: 8 }]}>
          <View style={[styles.illTaskRow, { borderColor: colors.border, backgroundColor: "#F6FFF8" }]}>
            <CheckCircle2 size={18} color="#198038" />
            <Text style={{ fontSize: 12, flex: 1, textDecorationLine: "line-through", color: colors.textMuted, fontWeight: "600" }}>Leitura de Capítulo 1</Text>
            <Volume2 size={16} color={accentColor} />
          </View>
          <View style={[styles.illTaskRow, { borderColor: colors.border, backgroundColor: colors.surfaceSubtle }]}>
            <Circle size={18} color="#D87700" />
            <Text style={{ fontSize: 12, flex: 1, color: colors.text, fontWeight: "600" }}>Exercício Prático</Text>
            <Clock size={16} color="#D87700" />
          </View>
        </View>
      );

    case "tasks-step-1":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.illButton, { backgroundColor: accentColor, flex: 1.5, flexDirection: "row", gap: 6 }]}>
              <Plus size={18} color="#FFF" />
              <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 14 }}>Nova Atividade</Text>
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Mic size={18} color={accentColor} />
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Calendar size={18} color={accentColor} />
            </View>
          </View>
        </View>
      );

    case "tasks-step-2":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border, gap: 10 }]}>
          <View style={styles.illRow}>
            <Target size={22} color="#F1C21B" />
            <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text, flex: 1 }}>Progresso Diário</Text>
            <Text style={{ fontSize: 13, fontWeight: "900", color: "#198038" }}>75% Concluído</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
            <View style={[styles.progressFill, { width: "75%", backgroundColor: "#198038" }]} />
          </View>
        </View>
      );

    case "tasks-step-3":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, gap: 8 }]}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <View style={[styles.chipMock, { backgroundColor: accentColor }]}>
              <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "bold" }}>Todas [4]</Text>
            </View>
            <View style={[styles.chipMock, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={{ color: colors.text, fontSize: 11 }}>Pendentes [1]</Text>
            </View>
            <View style={[styles.chipMock, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={{ color: colors.text, fontSize: 11 }}>Concluídas [3]</Text>
            </View>
          </View>
          <View style={[styles.illTaskRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <CheckCircle2 size={16} color="#198038" />
            <Text style={{ fontSize: 12, flex: 1, color: colors.text }}>Revisar Aulas Online</Text>
            <Trash2 size={16} color={colors.urgent} />
          </View>
        </View>
      );

    case "profile-step-1":
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.avatarMock, { backgroundColor: accentColor }]}>
              <User size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.text }}>Estudante SeniorEase</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>aluno.fiap@seniorease.com</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <PhoneCall size={12} color="#198038" />
                <Text style={{ fontSize: 11, color: "#198038", fontWeight: "bold" }}>Cuidador cadastrado</Text>
              </View>
            </View>
          </View>
        </View>
      );

    case "profile-step-2":
      return (
        <View style={[styles.illBox, { backgroundColor: "#E6F4EA", borderColor: "#34A853", borderWidth: 1, alignItems: "center", paddingVertical: 14 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <ShieldCheck size={32} color="#198038" />
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: "#0D5323" }}>Segurança e Memória Local</Text>
              <Text style={{ fontSize: 11, color: "#198038" }}>Preferências salvas no dispositivo</Text>
            </View>
          </View>
        </View>
      );

    default:
      return null;
  }
};

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
      if (onStepChange) {
        onStepChange(0, steps[0].scrollY);
      }
    }
  }, [visible, steps]);

  if (!visible || steps.length === 0) return null;

  const step = steps[currentStepIndex];

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
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

  const handleSpeakCurrentStep = () => {
    if (step) {
      speakText(step.voiceText || `${step.title}. ${step.description}`);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.popoverCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.popoverHeader}>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              Passo {currentStepIndex + 1} de {steps.length}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Fechar tour">
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContent} 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.targetLabelBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.targetLabelText, { color: colors.primary, fontSize: Math.round(13 * fontScale) }]}>
                📍 Apontando para: {step.targetName}
              </Text>
            </View>

            <Text style={[styles.stepTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
              {step.title}
            </Text>

            <TourIllustrationBox stepId={step.id} theme={theme} />

            <Text style={[styles.stepDesc, { color: colors.textMuted, fontSize: Math.round(15 * fontScale) }]}>
              {step.description}
            </Text>

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

            <View style={[styles.tipBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <Text style={[styles.tipText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
                💡 <Text style={{ fontWeight: "bold" }}>Dica:</Text> {step.tip}
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
                {currentStepIndex === steps.length - 1 ? "Concluir" : "Próximo"}
              </Text>
              {currentStepIndex === steps.length - 1 ? (
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  popoverCard: {
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
  popoverHeader: {
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
  scrollContent: {
    flexShrink: 1,
  },
  scrollContainer: {
    gap: 14,
    paddingBottom: 10,
  },
  targetLabelBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  targetLabelText: {
    fontWeight: "bold",
  },
  stepTitle: {
    fontWeight: "bold",
    textAlign: "left",
  },
  stepDesc: {
    lineHeight: 22,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  audioBtnText: {
    fontWeight: "bold",
  },
  tipBox: {
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

  // Illustration Box Styles
  illBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
  },
  illRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  illCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  illCircleSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  illActionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMock: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  illPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  illButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  illTile: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  illTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  chipMock: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
});
