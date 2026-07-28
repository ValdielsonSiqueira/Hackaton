import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { Target, Sparkles, ArrowRight } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";
import type { MobileTaskItem } from "../../context/AppContext";

interface DashboardPriorityTaskCardProps {
  nextTask?: MobileTaskItem;
  onExecuteNextTask: () => void;
  onNavigateTab: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardPriorityTaskCard: React.FC<DashboardPriorityTaskCardProps> = ({
  nextTask,
  onExecuteNextTask,
  onNavigateTab,
  onLayout,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View
      style={[
        styles.priorityCard,
        { 
          backgroundColor: colors.surfaceSubtle, 
          borderColor: colors.border, 
          borderWidth: colors.borderWidth,
          borderLeftWidth: 4,
          borderLeftColor: primaryAccentColor,
        },
      ]}
      onLayout={onLayout}
      id="priority-task-card"
    >
      <View style={styles.priorityTopRow}>
        <View style={[styles.targetIconBox, { backgroundColor: primaryAccentColor }]}>
          <Target size={24} color={colors.primaryContrast} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.priorityTagRow}>
            <Sparkles size={12} color={primaryAccentColor} />
            <Text style={[styles.priorityTagText, { color: primaryAccentColor }]}>
              PRÓXIMA ATIVIDADE PRIORITÁRIA
            </Text>
          </View>

          <Text style={[styles.priorityTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            {nextTask ? nextTask.title : "Nenhuma atividade pendente"}
          </Text>

          <Text style={[styles.prioritySubText, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            {nextTask
              ? `Vence ${nextTask.due} — Atividade prioritária.`
              : "Parabéns! Todas as suas tarefas foram concluídas."}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionBtnPrimary, { backgroundColor: primaryAccentColor }]}
        onPress={() => {
          if (nextTask) {
            onExecuteNextTask();
          } else {
            onNavigateTab("tasks");
          }
        }}
      >
        <Text style={[styles.actionBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
          {nextTask ? "Executar Atividade Agora" : "Ver Todas as Atividades"}
        </Text>
        <ArrowRight size={18} color={colors.primaryContrast} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  priorityCard: {
    padding: 18,
    borderRadius: 12,
    gap: 14,
  },
  priorityTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  targetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  priorityTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  prioritySubText: {
    lineHeight: 20,
  },
  actionBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionBtnText: {
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
  },
});
