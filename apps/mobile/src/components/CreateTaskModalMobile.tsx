import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { MobileTaskItem, TaskStep } from "../context/AppContext";
import { Mic, Sparkles, Trash2, Calendar, ChevronDown } from "lucide-react-native";

interface CreateTaskModalMobileProps {
  editingTask: MobileTaskItem | null;
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  onSaveTask: (taskData: {
    id?: string;
    title: string;
    category: string;
    priority: "low" | "medium" | "high";
    due: string;
    steps?: TaskStep[];
  }) => void;
  triggerToast: (msg: string) => void;
  speakText: (text: string) => void;
}

const CATEGORIES = ["Acadêmico", "Aula online", "Leitura", "Participação", "Exercício"];
const DUE_PRESETS = ["HOJE 18:00", "HOJE 20:00", "AMANHÃ 09:00", "AMANHÃ 14:00"];

export const CreateTaskModalMobile: React.FC<CreateTaskModalMobileProps> = ({
  editingTask,
  visible,
  theme,
  onClose,
  onSaveTask,
  triggerToast,
  speakText,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Acadêmico");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [due, setDue] = useState("HOJE 18:00");
  const [stepInputs, setStepInputs] = useState<string[]>([""]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDue(editingTask.due);
      setStepInputs(
        editingTask.steps && editingTask.steps.length > 0
          ? editingTask.steps.map((s) => s.text)
          : [""]
      );
    } else {
      setTitle("");
      setCategory("Acadêmico");
      setPriority("medium");
      setDue("HOJE 18:00");
      setStepInputs([""]);
    }
    setTitleError(null);
  }, [editingTask, visible]);

  const handleStartDictation = () => {
    setIsListening(true);
    triggerToast("🎙️ Fale o nome da atividade em alta voz...");
    speakText("Pode falar o nome da atividade agora.");
    setTimeout(() => {
      setIsListening(false);
    }, 4000);
  };

  const handleAddStepInput = () => {
    setStepInputs([...stepInputs, ""]);
  };

  const handleStepInputChange = (index: number, text: string) => {
    const updated = [...stepInputs];
    updated[index] = text;
    setStepInputs(updated);
  };

  const handleRemoveStepInput = (index: number) => {
    setStepInputs(stepInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setTitleError(null);

    if (!title.trim()) {
      setTitleError("Por favor, digite o nome da atividade");
      triggerToast("⚠️ Digite o nome da atividade");
      return;
    }

    const formattedSteps: TaskStep[] = stepInputs
      .filter((s) => s.trim().length > 0)
      .map((text, idx) => {
        const existingDone = editingTask?.steps?.find((s) => s.text === text.trim())?.done || false;
        return {
          id: idx + 1,
          text: text.trim(),
          done: existingDone,
        };
      });

    onSaveTask({
      id: editingTask?.id,
      title: title.trim(),
      category: category.toUpperCase(),
      priority,
      due,
      steps: formattedSteps.length > 0 ? formattedSteps : undefined,
    });

    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        {/* Card Container with 4px Solid Blue Left Border matching Web 1:1 */}
        <View
          style={[
            styles.modalCard,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: colors.borderWidth,
              borderLeftWidth: 4,
              borderLeftColor: primaryAccentColor,
            },
          ]}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
              {editingTask ? "Editar Atividade e Passos" : "Cadastrar Nova Atividade"}
            </Text>
            <View style={[styles.badgeTagWeb, { backgroundColor: isHighContrast ? "#222200" : "#E5EDFF" }]}>
              <Text style={[styles.badgeTagTextWeb, { color: primaryAccentColor }]}>
                {editingTask ? "MODO EDIÇÃO" : "FORMULÁRIO ASSISTIDO"}
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Field 1: Title + Voice Mic */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                  1. Nome da Atividade
                </Text>
                <Text style={[styles.subLabel, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
                  Digite ou use o microfone
                </Text>
              </View>

              <View style={styles.inputMicRow}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      color: colors.text,
                      borderColor: titleError ? colors.urgent : colors.border,
                    },
                  ]}
                  placeholder="Ex: Ler capítulo 5 de UX Design"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    if (titleError) setTitleError(null);
                  }}
                />
                <TouchableOpacity
                  style={[styles.micBtnSquare, { backgroundColor: isListening ? colors.urgent : primaryAccentColor }]}
                  onPress={handleStartDictation}
                >
                  <Mic size={22} color={colors.primaryContrast} />
                </TouchableOpacity>
              </View>
              {titleError ? (
                <Text style={[styles.errorText, { color: colors.urgent }]}>{titleError}</Text>
              ) : (
                <Text style={[styles.hintText, { color: colors.textMuted, fontSize: Math.round(11 * fontScale) }]}>
                  Escreva um nome simples e claro para a tarefa
                </Text>
              )}
            </View>

            {/* Field 2: Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                2. Categoria
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: category === cat ? primaryAccentColor : colors.surfaceSubtle,
                        borderColor: category === cat ? primaryAccentColor : colors.border,
                        borderWidth: colors.borderWidth,
                      },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catChipText, { color: category === cat ? colors.primaryContrast : colors.text, fontSize: Math.round(13 * fontScale) }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Field 3: Priority Selector (Replicating Web 3 Priority Buttons 1:1) */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                3. Nível de Prioridade
              </Text>
              <View style={styles.priorityRow}>
                {/* Baixa Button */}
                <TouchableOpacity
                  style={[
                    styles.prioBtn,
                    {
                      backgroundColor: priority === "low" ? colors.success : colors.surfaceSubtle,
                      borderColor: priority === "low" ? colors.success : colors.border,
                      borderWidth: priority === "low" ? 2 : colors.borderWidth,
                    },
                  ]}
                  onPress={() => setPriority("low")}
                >
                  <View style={[styles.dotCircle, { backgroundColor: priority === "low" ? "#FFFFFF" : colors.success }]} />
                  <Text style={[styles.prioBtnText, { color: priority === "low" ? "#FFFFFF" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
                    Baixa
                  </Text>
                </TouchableOpacity>

                {/* Média Button (Gold Yellow) */}
                <TouchableOpacity
                  style={[
                    styles.prioBtn,
                    {
                      backgroundColor: priority === "medium" ? (isHighContrast ? colors.primary : "#F1C21B") : colors.surfaceSubtle,
                      borderColor: priority === "medium" ? (isHighContrast ? colors.primary : "#F1C21B") : colors.border,
                      borderWidth: priority === "medium" ? 2 : colors.borderWidth,
                    },
                  ]}
                  onPress={() => setPriority("medium")}
                >
                  <View style={[styles.dotCircle, { backgroundColor: priority === "medium" ? "#161616" : "#F1C21B" }]} />
                  <Text style={[styles.prioBtnText, { color: priority === "medium" ? "#161616" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
                    Média
                  </Text>
                </TouchableOpacity>

                {/* Urgente Button (Red) */}
                <TouchableOpacity
                  style={[
                    styles.prioBtn,
                    {
                      backgroundColor: priority === "high" ? colors.urgent : colors.surfaceSubtle,
                      borderColor: priority === "high" ? colors.urgent : colors.border,
                      borderWidth: priority === "high" ? 2 : colors.borderWidth,
                    },
                  ]}
                  onPress={() => setPriority("high")}
                >
                  <View style={[styles.dotCircle, { backgroundColor: priority === "high" ? "#FFFFFF" : colors.urgent }]} />
                  <Text style={[styles.prioBtnText, { color: priority === "high" ? "#FFFFFF" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
                    Urgente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Field 4: Horário e Lembrete (Replicating Web DateTimePicker 1:1) */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                4. Horário e Lembrete
              </Text>
              
              {/* Active Due Display Box */}
              <View style={[styles.dueActiveBox, { backgroundColor: colors.card, borderColor: primaryAccentColor }]}>
                <Calendar size={18} color={primaryAccentColor} />
                <Text style={[styles.dueActiveText, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                  {due}
                </Text>
                <View style={[styles.calendarBadgeWeb, { backgroundColor: isHighContrast ? "#222200" : "#E5EDFF" }]}>
                  <Text style={[styles.calendarBadgeTextWeb, { color: primaryAccentColor }]}>
                    CALENDÁRIO ▼
                  </Text>
                </View>
              </View>

              {/* Due Preset Buttons */}
              <View style={styles.duePresetsRow}>
                {DUE_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.duePresetBtn,
                      {
                        backgroundColor: due === preset ? primaryAccentColor : colors.surfaceSubtle,
                        borderColor: due === preset ? primaryAccentColor : colors.border,
                        borderWidth: colors.borderWidth,
                      },
                    ]}
                    onPress={() => setDue(preset)}
                  >
                    <Text
                      style={[
                        styles.duePresetBtnText,
                        { 
                          color: due === preset ? colors.primaryContrast : colors.text, 
                          fontSize: Math.round(15 * fontScale), 
                        },
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Field 5: Passos Guiados Dinâmicos (Mobile Optimized Layout) */}
            <View style={[styles.fieldGroup, styles.stepsSection]}>
              <View style={styles.stepsHeaderCol}>
                <View style={styles.sparklesLabelRow}>
                  <Sparkles size={16} color={primaryAccentColor} />
                  <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                    5. Passos Guiados (Opcional)
                  </Text>
                </View>
                <TouchableOpacity style={[styles.addStepBtnOutline, { borderColor: primaryAccentColor }]} onPress={handleAddStepInput}>
                  <Text style={[styles.addStepBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
                    + Adicionar Passo
                  </Text>
                </TouchableOpacity>
              </View>

              {stepInputs.map((stepText, idx) => (
                <View key={idx} style={styles.stepInputRow}>
                  <View style={[styles.stepNumBadge, { backgroundColor: primaryAccentColor }]}>
                    <Text style={[styles.stepNumBadgeText, { color: colors.primaryContrast }]}>{idx + 1}</Text>
                  </View>
                  <TextInput
                    style={[styles.stepTextInput, { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.border }]}
                    placeholder={`Ex: Passo ${idx + 1} — Abrir o portal...`}
                    placeholderTextColor={colors.textMuted}
                    value={stepText}
                    onChangeText={(t) => handleStepInputChange(idx, t)}
                  />
                  {stepInputs.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveStepInput(idx)} style={styles.removeStepBtn}>
                      <Trash2 size={18} color={colors.urgent} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Form Actions Footer */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor }]} onPress={handleSubmit}>
                <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
                  {editingTask ? "Atualizar Atividade" : "Salvar Atividade"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.cancelBtnOutline, { borderColor: primaryAccentColor }]} onPress={onClose}>
                <Text style={[styles.cancelBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(15 * fontScale) }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "92%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 8,
  },
  modalTitle: {
    fontWeight: "normal",
    flex: 1,
  },
  badgeTagWeb: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTagTextWeb: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  scrollBody: {
    gap: 16,
    paddingVertical: 6,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sparklesLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontWeight: "bold",
  },
  subLabel: {},
  inputMicRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 52,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  micBtnSquare: {
    width: 52,
    height: 52,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  catScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  catChipText: {
    fontWeight: "bold",
  },
  priorityRow: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  prioBtn: {
    width: "100%",
    minHeight: 58,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  dotCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  prioBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  dueActiveBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
  },
  dueActiveText: {
    fontWeight: "bold",
    flex: 1,
  },
  calendarBadgeWeb: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  calendarBadgeTextWeb: {
    fontSize: 11,
    fontWeight: "bold",
  },
  duePresetsRow: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
    width: "100%",
  },
  duePresetBtn: {
    width: "100%",
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexWrap: "wrap",
  },
  duePresetBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  stepsSection: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  stepsHeaderCol: {
    gap: 8,
    width: "100%",
    marginBottom: 8,
  },
  addStepBtnOutline: {
    width: "100%",
    minHeight: 56,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addStepBtnOutlineText: {
    fontWeight: "bold",
  },
  stepInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  stepNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumBadgeText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  stepTextInput: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  removeStepBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  actionRow: {
    gap: 12,
    marginTop: 14,
  },
  submitBtnPrimary: {
    minHeight: 60,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexWrap: "wrap",
  },
  submitBtnPrimaryText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  cancelBtnOutline: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    flexWrap: "wrap",
  },
  cancelBtnOutlineText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
});
