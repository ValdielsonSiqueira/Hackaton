import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { LogOut, ArrowRight } from "lucide-react-native";

interface SignOutModalMobileProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  onConfirmSignOut: () => void;
}

export const SignOutModalMobile: React.FC<SignOutModalMobileProps> = ({
  visible,
  theme,
  onClose,
  onConfirmSignOut,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";

  const primaryBtnBg = isHighContrast ? colors.primary : "#0F62FE";
  const primaryBtnTextColor = colors.primaryContrast;
  const cancelBorderColor = isHighContrast ? colors.border : "#0F62FE";
  const cancelTextColor = isHighContrast ? colors.text : "#0F62FE";

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            { 
              backgroundColor: colors.card, 
              borderColor: isHighContrast ? colors.border : "#E0E0E0", 
              borderWidth: isHighContrast ? 2 : 1 
            },
          ]}
        >
          {/* Red LogOut Icon (Matching Web 1:1) */}
          <LogOut size={48} color="#DA1E28" style={{ alignSelf: "center", marginBottom: 4 }} />

          {/* Heading & Description (Verbatim Web Text) */}
          <Text style={[styles.modalTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
            Tem certeza que quer sair?
          </Text>

          <Text style={[styles.modalSub, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            Suas preferências estão salvas e você poderá entrar novamente quando quiser.
          </Text>

          {/* Action Buttons (Matching Web Buttons 1:1) */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: primaryBtnBg }]}
              onPress={onConfirmSignOut}
            >
              <Text style={[styles.confirmBtnText, { color: primaryBtnTextColor, fontSize: Math.round(15 * fontScale) }]}>
                Sim, quero sair
              </Text>
              <ArrowRight size={18} color={primaryBtnTextColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: cancelBorderColor, backgroundColor: colors.card }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelBtnText, { color: cancelTextColor, fontSize: Math.round(15 * fontScale) }]}>
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    padding: 24,
    borderRadius: 0,
    gap: 12,
    elevation: 12,
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSub: {
    textAlign: "center",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "column",
    width: "100%",
    gap: 12,
    marginTop: 14,
  },
  confirmBtn: {
    width: "100%",
    minHeight: 58,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  confirmBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  cancelBtn: {
    width: "100%",
    minHeight: 58,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexWrap: "wrap",
  },
  cancelBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
});
