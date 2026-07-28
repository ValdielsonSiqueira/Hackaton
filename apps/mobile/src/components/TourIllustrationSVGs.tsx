import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Mic, Type, Volume2, CheckCircle, HeartHandshake } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";

interface IllustrationProps {
  colors: MobileThemeColors;
}

export const DictationTourIllustration: React.FC<IllustrationProps> = ({ colors }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Mic size={20} color="#FFFFFF" />
        <Text style={styles.badgeText}>DITADO POR VOZ</Text>
      </View>
      <View style={[styles.waveContainer, { backgroundColor: colors.surfaceSubtle }]}>
        <Volume2 size={24} color={colors.primary} />
        <Text style={[styles.transcriptText, { color: colors.text }]}>"Ler capítulo 5 de UX Design..."</Text>
      </View>
    </View>
  );
};

export const A11yScaleTourIllustration: React.FC<IllustrationProps> = ({ colors }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <View style={[styles.btnBox, { backgroundColor: colors.primary }]}>
          <Text style={styles.btnText}>A-</Text>
        </View>
        <View style={[styles.btnBox, { backgroundColor: colors.primary }]}>
          <Text style={styles.btnText}>A+</Text>
        </View>
        <View style={[styles.btnBox, { backgroundColor: colors.surfaceSubtle }]}>
          <Type size={18} color={colors.text} />
        </View>
      </View>
      <Text style={[styles.previewText, { color: colors.text }]}>Texto grande e legível 150%</Text>
    </View>
  );
};

export const PriorityTaskTourIllustration: React.FC<IllustrationProps> = ({ colors }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.rowBetween}>
        <View style={styles.rowGap}>
          <CheckCircle size={22} color={colors.primary} />
          <Text style={[styles.taskTitle, { color: colors.text }]}>Estudar para Prova FIAP</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: "#DA1E28" }]}>
          <Text style={styles.priorityText}>URGENTE</Text>
        </View>
      </View>
    </View>
  );
};

export const CaregiverSupportTourIllustration: React.FC<IllustrationProps> = ({ colors }) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.rowGap}>
        <HeartHandshake size={24} color={colors.primary} />
        <View>
          <Text style={[styles.taskTitle, { color: colors.text }]}>Apoio Familiar & Cuidador</Text>
          <Text style={[styles.subText, { color: colors.textMuted }]}>Contato de emergência registrado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginVertical: 12,
    width: "100%",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
  },
  transcriptText: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  previewText: {
    fontSize: 15,
    fontWeight: "600",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  subText: {
    fontSize: 12,
    marginTop: 2,
  },
});
