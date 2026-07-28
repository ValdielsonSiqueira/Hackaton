import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";

interface MobileTaskPrioritySelectorProps {
  priority: "low" | "medium" | "high";
  onChangePriority: (p: "low" | "medium" | "high") => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const MobileTaskPrioritySelector: React.FC<MobileTaskPrioritySelectorProps> = ({
  priority,
  onChangePriority,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
        3. Nível de Prioridade
      </Text>
      <View style={styles.priorityRow}>
        <TouchableOpacity
          style={[
            styles.prioBtn,
            {
              backgroundColor: priority === "low" ? colors.success : colors.surfaceSubtle,
              borderColor: priority === "low" ? colors.success : colors.border,
              borderWidth: priority === "low" ? 2 : colors.borderWidth,
            },
          ]}
          onPress={() => onChangePriority("low")}
        >
          <View style={[styles.dotCircle, { backgroundColor: priority === "low" ? "#FFFFFF" : colors.success }]} />
          <Text style={[styles.prioBtnText, { color: priority === "low" ? "#FFFFFF" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Baixa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.prioBtn,
            {
              backgroundColor: priority === "medium" ? (isHighContrast ? colors.primary : "#F1C21B") : colors.surfaceSubtle,
              borderColor: priority === "medium" ? (isHighContrast ? colors.primary : "#F1C21B") : colors.border,
              borderWidth: priority === "medium" ? 2 : colors.borderWidth,
            },
          ]}
          onPress={() => onChangePriority("medium")}
        >
          <View style={[styles.dotCircle, { backgroundColor: priority === "medium" ? "#161616" : "#F1C21B" }]} />
          <Text style={[styles.prioBtnText, { color: priority === "medium" ? "#161616" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Média
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.prioBtn,
            {
              backgroundColor: priority === "high" ? colors.urgent : colors.surfaceSubtle,
              borderColor: priority === "high" ? colors.urgent : colors.border,
              borderWidth: priority === "high" ? 2 : colors.borderWidth,
            },
          ]}
          onPress={() => onChangePriority("high")}
        >
          <View style={[styles.dotCircle, { backgroundColor: priority === "high" ? "#FFFFFF" : colors.urgent }]} />
          <Text style={[styles.prioBtnText, { color: priority === "high" ? "#FFFFFF" : colors.text, fontSize: Math.round(16 * fontScale) }]}>
            Urgente
          </Text>
        </TouchableOpacity>
      </View>
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
  priorityRow: {
    flexDirection: "column",
    gap: 10,
  },
  prioBtn: {
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 8,
  },
  dotCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  prioBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
});
