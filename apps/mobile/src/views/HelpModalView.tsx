import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Linking, 
  Alert 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { PhoneCall, X } from "lucide-react-native";

interface HelpModalViewProps {
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
}

export const HelpModalView: React.FC<HelpModalViewProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryColor = isHighContrast ? colors.primary : "#0F62FE";

  const handleCall = () => {
    Linking.openURL("tel:08007008000").catch(() => {
      Alert.alert("Suporte Telefônico", "Ligue gratuitamente para 0800 700 8000.");
    });
  };

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
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Blue Phone Call Icon (Matching Web 1:1) */}
          <PhoneCall size={48} color={primaryColor} style={{ alignSelf: "center", marginBottom: 4 }} />

          {/* Verbatim Web Heading & Description */}
          <Text style={[styles.modalTitle, { color: colors.text, fontSize: Math.round(20 * fontScale) }]}>
            Central de Ajuda SeniorEase
          </Text>

          <Text style={[styles.modalSub, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            Você não está sozinho! Nossa equipe de suporte inclusivo SeniorEase está pronta para ajudar.
          </Text>

          {/* Action Buttons (Matching Web 1:1) */}
          <View style={styles.actionCol}>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: primaryColor }]} onPress={handleCall}>
              <Text style={[styles.callBtnText, { color: colors.primaryContrast, fontSize: Math.round(15 * fontScale) }]}>
                📞 Ligar para Suporte (0800 700 8000)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelBtn, { borderColor: isHighContrast ? colors.border : "#E0E0E0" }]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
                Fechar Ajuda
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
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSub: {
    textAlign: "center",
    lineHeight: 20,
  },
  actionCol: {
    gap: 12,
    marginTop: 12,
  },
  callBtn: {
    width: "100%",
    minHeight: 60,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  callBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  cancelBtn: {
    width: "100%",
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  cancelBtnText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
});
