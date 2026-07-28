import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { Sparkles, Trash2 } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";

interface MobileTaskStepsSectionProps {
  stepInputs: string[];
  onAddStep: () => void;
  onChangeStep: (index: number, text: string) => void;
  onRemoveStep: (index: number) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const MobileTaskStepsSection: React.FC<MobileTaskStepsSectionProps> = ({
  stepInputs,
  onAddStep,
  onChangeStep,
  onRemoveStep,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View style={[styles.fieldGroup, styles.stepsSection]}>
      <View style={styles.stepsHeaderCol}>
        <View style={styles.sparklesLabelRow}>
          <Sparkles size={16} color={primaryAccentColor} />
          <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
            5. Passos Guiados (Opcional)
          </Text>
        </View>
        <TouchableOpacity style={[styles.addStepBtnOutline, { borderColor: primaryAccentColor }]} onPress={onAddStep}>
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
            onChangeText={(t) => onChangeStep(idx, t)}
          />
          {stepInputs.length > 1 && (
            <TouchableOpacity onPress={() => onRemoveStep(idx)} style={styles.removeStepBtn}>
              <Trash2 size={18} color={colors.urgent} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontWeight: "bold",
  },
  stepsSection: {
    marginTop: 6,
  },
  stepsHeaderCol: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  sparklesLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addStepBtnOutline: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  removeStepBtn: {
    padding: 8,
  },
});
