import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { PartyPopper, Sparkles, CheckCircle2 } from "lucide-react-native";

interface CelebrationOverlayMobileProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  speakText: (text: string) => void;
}

export const CelebrationOverlayMobile: React.FC<CelebrationOverlayMobileProps> = ({
  visible,
  theme,
  onClose,
  speakText,
}) => {
  const { colors, fontScale } = theme;

  useEffect(() => {
    if (visible) {
      speakText("Parabéns! Você concluiu todas as suas atividades acadêmicas de hoje!");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.success, borderWidth: 2 }]}>
          <PartyPopper size={Math.round(52 * fontScale)} color={colors.success} style={{ alignSelf: "center", marginBottom: 6 }} />

          <Text style={[styles.modalTitle, { color: colors.text, fontSize: Math.round(22 * fontScale) }]}>
            Parabéns! 🎉
          </Text>

          <Text style={[styles.modalSub, { color: colors.textMuted, fontSize: Math.round(15 * fontScale) }]}>
            Você concluiu <Text style={{ fontWeight: "bold", color: colors.success }}>100% das suas atividades acadêmicas</Text> para hoje no SeniorEase!
          </Text>

          <View style={[styles.badgeBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Sparkles size={20} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              Meta do Dia Alcançada com Sucesso!
            </Text>
          </View>

          <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={onClose}>
            <CheckCircle2 size={20} color={colors.primaryContrast} />
            <Text style={[styles.confirmBtnText, { color: colors.primaryContrast, fontSize: Math.round(16 * fontScale) }]}>
              Continuar Aprendendo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    padding: 24,
    borderRadius: 0,
    gap: 14,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSub: {
    textAlign: "center",
    lineHeight: 22,
  },
  badgeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 0,
  },
  badgeText: {
    fontWeight: "bold",
  },
  confirmBtn: {
    minHeight: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 0,
    marginTop: 8,
  },
  confirmBtnText: {
    fontWeight: "bold",
  },
});
