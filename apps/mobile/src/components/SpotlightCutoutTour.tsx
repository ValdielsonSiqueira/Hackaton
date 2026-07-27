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
  ChevronRight, 
  ChevronLeft, 
  Check,
  BookOpen,
  Flame,
  CheckCircle2,
  Eye,
  Sliders,
  BookCheck,
  User,
  PhoneCall,
  Clock,
  Mic,
  Calendar,
  Target,
  Trash2,
  ShieldCheck,
  RotateCcw,
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

/**
 * Helper component that generates rich SVG/Vector UI Illustrations for each tour step,
 * visually mirroring the exact areas of the app mentioned in the tour!
 */
const TourIllustrationBox: React.FC<{ stepId: string; theme: { colors: MobileThemeColors; fontScale: number } }> = ({ stepId, theme }) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const accentColor = isHighContrast ? colors.primary : "#0F62FE";

  switch (stepId) {
    case "step-1": // Banner de Boas-Vindas
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.illCircle, { backgroundColor: accentColor }]}>
              <BookOpen size={26} color="#FFFFFF" />
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

    case "step-2": // Atividade de Alta Prioridade
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border, borderLeftWidth: 6, borderLeftColor: "#DA1E28" }]}>
          <View style={styles.illRow}>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Flame size={16} color="#DA1E28" />
                <Text style={{ fontSize: 11, fontWeight: "900", color: "#DA1E28", textTransform: "uppercase" }}>Prioridade Alta / Urgente</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text }}>Entregar Relatório de UX</Text>
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: "#198038" }]}>
              <CheckCircle2 size={24} color="#FFFFFF" />
            </View>
          </View>
        </View>
      );

    case "step-3": // Painel de Acessibilidade
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

    case "step-4": // Módulos da Plataforma
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <BookCheck size={22} color={accentColor} />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>Atividades</Text>
            </View>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <User size={22} color="#8A3FFC" />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>Perfil</Text>
            </View>
            <View style={[styles.illTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <PhoneCall size={22} color="#198038" />
              <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.text }}>0800 Suporte</Text>
            </View>
          </View>
        </View>
      );

    case "step-5": // Lista de Atividades Recentes
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

    case "tasks-step-1": // Nova Atividade no TasksView
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.illButton, { backgroundColor: accentColor, flex: 1.5, flexDirection: "row", gap: 6 }]}>
              <Plus size={18} color="#FFF" />
              <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 14 }}>Nova Atividade</Text>
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Mic size={20} color={accentColor} />
            </View>
            <View style={[styles.illActionCircle, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
              <Calendar size={20} color={accentColor} />
            </View>
          </View>
        </View>
      );

    case "tasks-step-2": // Barra de Progresso
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border, gap: 10 }]}>
          <View style={styles.illRow}>
            <Target size={24} color="#F1C21B" />
            <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text, flex: 1 }}>Progresso Diário</Text>
            <Text style={{ fontSize: 14, fontWeight: "900", color: "#198038" }}>75% Concluído</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
            <View style={[styles.progressFill, { width: "75%", backgroundColor: "#198038" }]} />
          </View>
        </View>
      );

    case "tasks-step-3": // Filtros e Lista Detalhada
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

    case "profile-step-1": // Informações Cadastrais
      return (
        <View style={[styles.illBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.illRow}>
            <View style={[styles.avatarMock, { backgroundColor: accentColor }]}>
              <User size={26} color="#FFF" />
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

    case "profile-step-2": // Armazenamento Persistente
      return (
        <View style={[styles.illBox, { backgroundColor: "#E6F4EA", borderColor: "#34A853", borderWidth: 1, alignItems: "center", paddingVertical: 14 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <ShieldCheck size={36} color="#198038" />
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: "#0D5323" }}>Segurança e Memória Local</Text>
              <Text style={{ fontSize: 11, color: "#198038" }}>Preferências salvas no dispositivo</Text>
            </View>
          </View>
        </View>
      );

    case "profile-step-3": // Preferências de Acessibilidade no Perfil
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, gap: 8 }]}>
          <View style={styles.illRow}>
            <Sliders size={20} color={accentColor} />
            <Text style={{ fontSize: 12, fontWeight: "bold", color: colors.text, flex: 1 }}>Alto Contraste (AAA)</Text>
            <View style={[styles.toggleOnMock, { backgroundColor: "#198038" }]}>
              <View style={styles.toggleKnobMock} />
            </View>
          </View>
          <View style={[styles.illRow, { paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.border }]}>
            <RotateCcw size={16} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "600" }}>Botão para resetar preferências padrão</Text>
          </View>
        </View>
      );

    default: // Generic Fallback Illustration
      return (
        <View style={[styles.illBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, alignItems: "center", paddingVertical: 16 }]}>
          <View style={[styles.illCircle, { backgroundColor: accentColor }]}>
            <Sparkles size={28} color="#FFFFFF" />
          </View>
        </View>
      );
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
          {/* Header Tag - Fixed at top of card */}
          <View style={styles.popoverHeader}>
            <View style={[styles.tagBadge, { backgroundColor: colors.primary }]}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.tagBadgeText}>CONHEÇA A PLATAFORMA</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Middle Body (Protects layout against 150% font scale!) */}
          <ScrollView 
            style={styles.scrollContent} 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Section Indicator */}
            <View style={[styles.targetLabelBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.targetLabelText, { color: colors.primary }]}>
                📍 Apontando para: {step.targetName}
              </Text>
            </View>

            {/* NEW: SVG/Vector UI Feature Illustration! */}
            <TourIllustrationBox stepId={step.id} theme={theme} />

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
          </ScrollView>

          {/* Fixed Footer: Dots Progress & Controls */}
          <View style={styles.footerBlock}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.70)",
    justifyContent: "center",
    padding: 16,
  },
  popoverCard: {
    padding: 18,
    borderRadius: 0,
    elevation: 14,
    maxHeight: "85%",
    flexDirection: "column",
  },
  popoverHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  scrollContent: {
    flexShrink: 1,
  },
  scrollContainer: {
    gap: 12,
    paddingBottom: 4,
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
    lineHeight: 21,
  },
  voiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
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
    lineHeight: 18,
  },
  footerBlock: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150,150,150,0.2)",
  },
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
  controlsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
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
  // Illustration styles
  illBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 0,
    marginVertical: 4,
  },
  illRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  illCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  illCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  illPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  illButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },
  illTile: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  illTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderWidth: 1,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  chipMock: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMock: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOnMock: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    paddingHorizontal: 2,
    alignItems: "flex-end",
  },
  toggleKnobMock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
});
