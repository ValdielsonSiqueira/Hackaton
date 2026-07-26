import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { MobileTaskItem } from "../context/AppContext";
import { Trash2, X } from "lucide-react-native";

interface DeleteTaskModalMobileProps {
  task: MobileTaskItem | null;
  visible: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  onClose: () => void;
  onConfirmDelete: (taskId: string) => void;
}

export const DeleteTaskModalMobile: React.FC<DeleteTaskModalMobileProps> = ({
  task,
  visible,
  theme,
  onClose,
  onConfirmDelete,
}) => {
  if (!task) return null;
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            { 
              backgroundColor: colors.card, 
              borderColor: "#DA1E28", 
              borderWidth: 2,
              borderTopWidth: 6, 
            },
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Red Trash Icon Badge (Matching Web 1:1) */}
          <View style={styles.iconCircle}>
            <Trash2 size={24} color="#DA1E28" />
          </View>

          {/* Verbatim Web Heading & Text */}
          <Text style={[styles.modalTitle, { color: colors.text, fontSize: Math.round(18 * fontScale) }]}>
            Tem certeza que deseja excluir?
          </Text>

          <Text style={[styles.modalSub, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
            A atividade <Text style={{ fontWeight: "bold", color: colors.text }}>"{task.title}"</Text> será removida permanentemente.
          </Text>

          {/* Action Buttons (Matching Web 1:1) */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: "#DA1E28" }]}
              onPress={() => onConfirmDelete(task.id)}
            >
              <Trash2 size={18} color="#FFFFFF" />
              <Text style={[styles.confirmBtnText, { fontSize: Math.round(15 * fontScale) }]}>
                Sim, excluir atividade
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelBtn, { borderColor: isHighContrast ? colors.border : "#E0E0E0" }]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                Cancelar
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
    padding: 20,
    borderRadius: 0,
    gap: 12,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "#FFF0F0",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
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
    gap: 10,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  confirmBtnText: {
    color: "#FFFFFF",
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
