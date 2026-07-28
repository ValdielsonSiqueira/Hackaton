import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { Volume2, Compass, BookOpen } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";

interface DashboardWelcomeBannerProps {
  studentFirstName: string;
  greetingText: string;
  greetingIcon: string;
  pendingCount: number;
  isSimplified: boolean;
  onSpeakSummary: () => void;
  onOpenTour: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const DashboardWelcomeBanner: React.FC<DashboardWelcomeBannerProps> = ({
  studentFirstName,
  greetingText,
  greetingIcon,
  pendingCount,
  isSimplified,
  onSpeakSummary,
  onOpenTour,
  onLayout,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";
  const bannerBg = isHighContrast ? "#000000" : "#161616";
  const bannerButtonBg = isHighContrast ? "#222200" : "#262626";

  return (
    <View
      style={[
        styles.bannerCard,
        { 
          backgroundColor: bannerBg, 
          borderColor: isHighContrast ? colors.border : "#333333", 
          borderWidth: isHighContrast ? 2 : 1 
        },
      ]}
      onLayout={onLayout}
      id="welcome-banner"
    >
      <View style={{ flex: 1 }}>
        {isSimplified && (
          <View style={[styles.simplifiedBadge, { backgroundColor: primaryAccentColor }]}>
            <Text style={[styles.simplifiedBadgeText, { color: colors.primaryContrast }]}>
              ✨ MODO SIMPLIFICADO ATIVO
            </Text>
          </View>
        )}

        <Text style={[styles.bannerGreeting, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(22 * fontScale) }]}>
          {greetingText}, {studentFirstName}! {greetingIcon}
        </Text>

        <Text style={[styles.bannerSub, { color: isHighContrast ? colors.textMuted : "#C6C6C6", fontSize: Math.round(14 * fontScale) }]}>
          {pendingCount > 0
            ? `Você tem ${pendingCount} ${pendingCount === 1 ? "atividade pendente" : "atividades pendentes"} hoje. Veja o que está planejado.`
            : "Você está em dia com todas as suas tarefas hoje!"}
        </Text>

        <View style={styles.bannerActionsRow}>
          <TouchableOpacity
            style={[styles.bannerBtn, { backgroundColor: bannerButtonBg, borderColor: isHighContrast ? colors.border : "#383838" }]}
            onPress={onSpeakSummary}
          >
            <Volume2 size={Math.round(20 * fontScale)} color={primaryAccentColor} />
            <Text style={[styles.bannerBtnText, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(15 * fontScale) }]}>
              Ouvir resumo por voz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bannerBtn, { backgroundColor: bannerButtonBg, borderColor: isHighContrast ? colors.border : "#383838" }]}
            onPress={onOpenTour}
          >
            <Compass size={Math.round(20 * fontScale)} color={primaryAccentColor} />
            <Text style={[styles.bannerBtnText, { color: isHighContrast ? colors.text : "#FFFFFF", fontSize: Math.round(15 * fontScale) }]}>
              Ver Tour Guiado
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.illustrationBox}>
        <BookOpen size={48} color={primaryAccentColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  simplifiedBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  simplifiedBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  bannerGreeting: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSub: {
    lineHeight: 22,
    marginBottom: 14,
  },
  bannerActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 1,
  },
  bannerBtnText: {
    fontWeight: "bold",
    flexShrink: 1,
  },
  illustrationBox: {
    padding: 8,
  },
});
