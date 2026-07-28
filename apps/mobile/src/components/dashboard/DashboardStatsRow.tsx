import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock, Flame } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";

interface DashboardStatsRowProps {
  completedCount: number;
  pendingCount: number;
  streakDays?: number;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({
  completedCount,
  pendingCount,
  streakDays = 7,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View style={styles.statsRow}>
      <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <CheckCircle2 size={Math.round(26 * fontScale)} color={colors.success} style={{ marginBottom: 8 }} />
        <Text style={[styles.statNumber, { color: colors.success, fontSize: Math.round(32 * fontScale) }]}>
          {completedCount}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
          Concluídas hoje
        </Text>
      </View>

      <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <Clock size={Math.round(26 * fontScale)} color={colors.text} style={{ marginBottom: 8 }} />
        <Text style={[styles.statNumber, { color: colors.text, fontSize: Math.round(32 * fontScale) }]}>
          {pendingCount}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
          Pendentes
        </Text>
      </View>

      <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <Flame size={Math.round(26 * fontScale)} color={primaryAccentColor} style={{ marginBottom: 8 }} />
        <Text style={[styles.statNumber, { color: primaryAccentColor, fontSize: Math.round(32 * fontScale) }]}>
          {streakDays}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
          Dias seguidos
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
  },
  statNumber: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
    fontWeight: "600",
    flexShrink: 1,
  },
});
