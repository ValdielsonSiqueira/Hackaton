import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { 
  Volume2, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Video, 
  BookOpen, 
  MessageSquare, 
  FileCheck 
} from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";
import type { MobileTaskItem } from "../../context/AppContext";

interface DashboardRecentTasksListProps {
  activityTasks: MobileTaskItem[];
  toggleActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  triggerToast: (msg: string) => void;
  onNavigateTab: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardRecentTasksList: React.FC<DashboardRecentTasksListProps> = ({
  activityTasks,
  toggleActivityTask,
  speakText,
  triggerToast,
  onNavigateTab,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const getActivityIcon = (category: string) => {
    const cat = (category || "").toUpperCase();
    if (cat.includes("AULA") || cat.includes("ONLINE")) return <Video size={20} color={primaryAccentColor} />;
    if (cat.includes("LEITURA")) return <BookOpen size={20} color={primaryAccentColor} />;
    if (cat.includes("PARTICIPAÇ") || cat.includes("FÓRUM")) return <MessageSquare size={20} color={colors.success} />;
    return <FileCheck size={20} color={colors.text} />;
  };

  return (
    <View style={[styles.recentOuterBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]} id="dashboard-recent-tasks">
      <View style={styles.recentHeaderCol}>
        <Text style={[styles.recentHeaderTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
          Minhas Atividades Recentes ({activityTasks.length})
        </Text>
        <TouchableOpacity
          style={[styles.addVerTodasBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => onNavigateTab("tasks")}
        >
          <Plus size={16} color={primaryAccentColor} />
          <Text style={[styles.addVerTodasBtnText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
            Adicionar / Ver Todas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.recentInnerCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        {activityTasks.map((t, idx) => (
          <View
            key={t.id}
            style={[
              styles.recentTaskRow,
              { borderBottomWidth: idx === activityTasks.length - 1 ? 0 : 1, borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.recentTaskHeaderBar}>
              <View style={styles.recentTaskIconGroup}>
                <TouchableOpacity
                  style={[styles.speakerCircleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => speakText(`Atividade: ${t.title}. Categoria: ${t.category || "Geral"}. Prazo: ${t.due}. Status: ${t.done ? "Concluída" : "Pendente"}.`)}
                >
                  <Volume2 size={Math.min(24, Math.round(18 * fontScale))} color={primaryAccentColor} />
                </TouchableOpacity>

                <View style={[styles.fileIconBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                  {getActivityIcon(t.category)}
                </View>
              </View>

              <View
                style={[
                  styles.statusBadgeWeb,
                  {
                    backgroundColor: t.done ? "#DEF8E9" : "#FFF8E1",
                    borderColor: t.done ? "#24A148" : "#F1C21B",
                  },
                ]}
              >
                <Text style={[styles.statusBadgeTextWeb, { color: t.done ? "#0D5323" : "#8C6B00" }]}>
                  {t.done ? "✓ FEITO" : "⏳ PENDENTE"}
                </Text>
              </View>
            </View>

            <Text style={[styles.recentTaskTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
              {t.title}
            </Text>

            <View style={styles.recentTaskMetaRow}>
              <Text style={[styles.recentTaskCatTag, { color: primaryAccentColor, fontSize: Math.round(12 * fontScale) }]}>
                {t.category ? t.category.toUpperCase() : "ACADÊMICO"}
              </Text>
              <Text style={[styles.recentTaskDueText, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                • {t.due}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.recentTaskToggleBtn,
                {
                  backgroundColor: t.done ? colors.surfaceSubtle : primaryAccentColor,
                  borderColor: t.done ? colors.border : primaryAccentColor,
                },
              ]}
              onPress={async () => {
                await toggleActivityTask(t.id);
                triggerToast(t.done ? "Atividade marcada como pendente" : "🎉 Atividade concluída!");
              }}
            >
              {t.done ? (
                <>
                  <CheckCircle2 size={18} color={colors.success} />
                  <Text style={[styles.recentTaskToggleText, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                    Concluída (Toque para reabrir)
                  </Text>
                </>
              ) : (
                <>
                  <Circle size={18} color={colors.primaryContrast} />
                  <Text style={[styles.recentTaskToggleText, { color: colors.primaryContrast, fontSize: Math.round(14 * fontScale) }]}>
                    Marcar como Concluída
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recentOuterBox: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  recentHeaderCol: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  recentHeaderTitle: {
    fontWeight: "bold",
    flexShrink: 1,
    width: "100%",
  },
  addVerTodasBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  addVerTodasBtnText: {
    fontWeight: "bold",
    flexShrink: 1,
  },
  recentInnerCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  recentTaskRow: {
    padding: 16,
    gap: 8,
  },
  recentTaskHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentTaskIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  speakerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeWeb: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeTextWeb: {
    fontSize: 11,
    fontWeight: "bold",
  },
  recentTaskTitle: {
    fontWeight: "bold",
    lineHeight: 22,
  },
  recentTaskMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  recentTaskCatTag: {
    fontWeight: "bold",
  },
  recentTaskDueText: {},
  recentTaskToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  recentTaskToggleText: {
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
  },
});
