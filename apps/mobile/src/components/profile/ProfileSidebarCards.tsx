import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckCircle2, ArrowRight } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";

interface ProfileSidebarCardsProps {
  onNavigateTab?: (tab: "dashboard" | "tasks" | "profile" | "help") => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const ProfileSidebarCards: React.FC<ProfileSidebarCardsProps> = ({
  onNavigateTab,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View style={styles.sidebarBlock} id="profile-sidebar-cards">
      <View style={[styles.card, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <View style={styles.sidebarTitleRow}>
          <CheckCircle2 size={18} color={primaryAccentColor} />
          <Text style={[styles.sidebarBadgeText, { color: primaryAccentColor, fontSize: Math.round(13 * fontScale) }]}>
            Armazenamento Persistente
          </Text>
        </View>
        <Text style={[styles.sidebarHeading, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
          Suas preferências estão seguras
        </Text>
        <Text style={[styles.sidebarDesc, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
          Toda alteração de tamanho de letra, alto contraste e confirmações é salva automaticamente no dispositivo.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <Text style={[styles.sidebarHeading, { color: colors.text, fontSize: Math.round(15 * fontScale), marginBottom: 10 }]}>
          Navegação Rápida
        </Text>
        <View style={styles.sidebarBtnsCol}>
          <TouchableOpacity
            style={[styles.submitBtnPrimary, { backgroundColor: primaryAccentColor }]}
            onPress={() => onNavigateTab?.("dashboard")}
          >
            <Text style={[styles.submitBtnPrimaryText, { color: colors.primaryContrast, fontSize: Math.round(14 * fontScale) }]}>
              Voltar ao Painel
            </Text>
            <ArrowRight size={18} color={colors.primaryContrast} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelBtnOutline, { borderColor: isHighContrast ? colors.border : "#E0E0E0", backgroundColor: colors.card }]}
            onPress={() => onNavigateTab?.("tasks")}
          >
            <Text style={[styles.cancelBtnOutlineText, { color: primaryAccentColor, fontSize: Math.round(14 * fontScale) }]}>
              Ver Minhas Atividades
            </Text>
            <ArrowRight size={18} color={primaryAccentColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarBlock: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  sidebarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sidebarBadgeText: {
    fontWeight: "bold",
  },
  sidebarHeading: {
    fontWeight: "bold",
  },
  sidebarDesc: {
    lineHeight: 18,
  },
  sidebarBtnsCol: {
    gap: 10,
  },
  submitBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 8,
  },
  submitBtnPrimaryText: {
    fontWeight: "bold",
  },
  cancelBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelBtnOutlineText: {
    fontWeight: "bold",
  },
});
