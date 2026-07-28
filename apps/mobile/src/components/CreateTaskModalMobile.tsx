import React, { useState, useEffect, useRef } from "react";
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
import { Mic } from "lucide-react-native";
import { DateTimePickerMobile } from "./DateTimePickerMobile";
import { MobileTaskPrioritySelector } from "./MobileTaskPrioritySelector";
import { MobileTaskStepsSection } from "./MobileTaskStepsSection";

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
  const titleInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDue(editingTask.due);
      setStepInputs(
        editingTask.steps && editingTask.steps.length > 0
          ? editingTask.steps.map((s: TaskStep) => s.text)
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
    if (visible) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [editingTask, visible]);

  const handleStartDictation = () => {
    const WebSpeechRecognition = typeof window !== "undefined" && ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition);
    if (WebSpeechRecognition) {
      try {
        const recognition = new WebSpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);
        triggerToast("🎙️ Ouvindo... Fale o nome da atividade");
        speakText("Pode falar o nome da atividade agora.");

        recognition.onresult = (event: any) => {
          const transcript = event?.results?.[0]?.[0]?.transcript || "";
          if (transcript) {
            setTitle(transcript.trim());
            if (titleError) setTitleError(null);
            triggerToast(`Atividade ditada: "${transcript.trim()}"`);
            speakText(`Atividade inserida: ${transcript.trim()}`);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          triggerToast("⚠️ Não foi possível captar a voz. Tente usar o teclado.");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
      }
    }

    titleInputRef.current?.focus();
    triggerToast("🎙️ Toque no ícone de microfone 🎤 no seu teclado na tela para ditar por voz!");
    speakText("Para ditar por voz no celular, toque no microfone do seu teclado aberto na tela.");
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
        const existingDone = editingTask?.steps?.find((s: TaskStep) => s.text === text.trim())?.done || false;
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
                  ref={titleInputRef}
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
                <Text style={[styles.hintText, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                  💡 Dica de Acessibilidade: No celular, toque no ícone de microfone 🎤 do seu teclado aberto na tela para transcrição de voz com precisão total.
                </Text>
              )}
            </View>

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

            <MobileTaskPrioritySelector
              priority={priority}
              onChangePriority={setPriority}
              theme={theme}
            />

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                4. Horário e Lembrete
              </Text>
              
              <DateTimePickerMobile
                value={due}
                onChange={setDue}
                theme={theme}
                triggerToast={triggerToast}
              />
            </View>

            <MobileTaskStepsSection
              stepInputs={stepInputs}
              onAddStep={handleAddStepInput}
              onChangeStep={handleStepInputChange}
              onRemoveStep={handleRemoveStepInput}
              theme={theme}
            />

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
  label: {
    fontWeight: "bold",
  },
  subLabel: {
    fontSize: 11,
  },
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
  actionRow: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  submitBtnPrimary: {
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
