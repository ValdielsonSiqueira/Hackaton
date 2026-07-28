import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Compass } from "lucide-react-native";
import type { MobileThemeColors } from "../../theme/mobileTheme";

interface ProfileHeaderCardProps {
  onOpenTour: () => void;
  theme: { colors: MobileThemeColors; fontScale: number };
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  onOpenTour,
  theme,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  return (
    <View style={styles.headerBlock} id="profile-header-card">
      <View style={styles.titleRowMobile}>
        <Text style={[styles.title, { color: colors.text, fontSize: Math.round(22 * fontScale) }]}>
          Suas Informações e Preferências
        </Text>
        <TouchableOpacity
          style={[styles.tourBtnWeb, { borderColor: isHighContrast ? colors.border : "#E0E0E0", backgroundColor: colors.card }]}
          onPress={onOpenTour}
        >
          <Compass size={16} color={primaryAccentColor} />
          <Text style={[styles.tourBtnWebText, { color: colors.text, fontSize: Math.round(13 * fontScale) }]}>
            Tour Guiado
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBlock: {},
  titleRowMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
  },
  tourBtnWeb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 6,
  },
  tourBtnWebText: {
    fontWeight: "bold",
  },
});
