import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { Accessibility, X, Eye, Moon, Sun, RotateCcw } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { UserSettings } from "@seniorease/core";

interface AccessibilityDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLeft: boolean;
  theme: { colors: MobileThemeColors; fontScale: number };
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
}

export const AccessibilityDrawerModal: React.FC<AccessibilityDrawerModalProps> = ({
  isOpen,
  onClose,
  isLeft,
  theme,
  settings,
  updateSettings,
}) => {
  const { colors, fontScale } = theme;
  const contrast = settings.contrastMode || "standard";
  const isHighContrast = contrast === "high";
  const badgeBg = isHighContrast ? "#000000" : "#24A148";

  const changeFontScale = async (delta: number) => {
    const currentScale = settings.fontScale || (settings.fontSizeScale === "large" ? 1.4 : settings.fontSizeScale === "medium" ? 1.2 : 1.0);
    const newScale = Math.min(Math.max(currentScale + delta, 0.9), 1.8);
    let fontSizeScale: "standard" | "medium" | "large" = "medium";
    if (newScale >= 1.3) fontSizeScale = "large";
    else if (newScale < 1.05) fontSizeScale = "standard";

    await updateSettings({
      ...settings,
      fontScale: newScale,
      fontSizeScale,
    });
  };

  const applyContrast = async (mode: "standard" | "high" | "dark") => {
    await updateSettings({ ...settings, contrastMode: mode });
  };

  const resetAll = async () => {
    await updateSettings({
      ...settings,
      contrastMode: "standard",
      fontScale: 1.0,
      fontSizeScale: "medium",
    });
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.backdrop, isLeft && styles.backdropLeft]} activeOpacity={1} onPress={onClose}>
        <View
          style={[
            styles.drawerPanel,
            { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : "#24A148" },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.drawerHeader, { backgroundColor: badgeBg }]}>
            <Text style={[styles.drawerTitle, { color: isHighContrast ? "#FFFF00" : "#FFFFFF" }]}>
              <Accessibility size={18} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} /> Acessibilidade
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.drawerRow, { backgroundColor: colors.surfaceSubtle }]} onPress={() => changeFontScale(0.1)}>
            <Text style={[styles.drawerRowText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
              A+ Aumentar Fonte
            </Text>
            <Text style={[styles.drawerRowSub, { color: colors.textMuted }]}>
              ({Math.round(fontScale * 100)}%)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.drawerRow, { backgroundColor: colors.surfaceSubtle }]} onPress={() => changeFontScale(-0.1)}>
            <Text style={[styles.drawerRowText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
              A- Diminuir Fonte
            </Text>
            <Text style={[styles.drawerRowSub, { color: colors.textMuted }]}>
              ({Math.round(fontScale * 100)}%)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerRow,
              { backgroundColor: contrast === "high" ? "#000000" : colors.surfaceSubtle },
              contrast === "high" && styles.activeHighContrast,
            ]}
            onPress={() => applyContrast("high")}
          >
            <Eye size={18} color={contrast === "high" ? "#FFFF00" : colors.text} />
            <Text style={[styles.drawerRowText, { color: contrast === "high" ? "#FFFF00" : colors.text, fontSize: Math.round(15 * fontScale) }]}>
              Contraste Alto (Preto/Amarelo)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerRow,
              { backgroundColor: contrast === "dark" ? "#161616" : colors.surfaceSubtle },
              contrast === "dark" && styles.activeDarkContrast,
            ]}
            onPress={() => applyContrast("dark")}
          >
            <Moon size={18} color={contrast === "dark" ? "#F1C21B" : colors.text} />
            <Text style={[styles.drawerRowText, { color: contrast === "dark" ? "#F1C21B" : colors.text, fontSize: Math.round(15 * fontScale) }]}>
              Modo Escuro (Grafite)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerRow,
              { backgroundColor: contrast === "standard" ? "#E5EDFF" : colors.surfaceSubtle },
            ]}
            onPress={() => applyContrast("standard")}
          >
            <Sun size={18} color={contrast === "standard" ? "#0F62FE" : colors.text} />
            <Text style={[styles.drawerRowText, { color: contrast === "standard" ? "#0F62FE" : colors.text, fontSize: Math.round(15 * fontScale) }]}>
              Contraste Padrão (Branco)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetRow} onPress={resetAll}>
            <RotateCcw size={18} color="#DA1E28" />
            <Text style={[styles.resetRowText, { fontSize: Math.round(15 * fontScale) }]}>
              Resetar Ajustes
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  backdropLeft: {
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingRight: 0,
  },
  drawerPanel: {
    width: 280,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drawerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 8,
  },
  drawerRowText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  drawerRowSub: {
    fontSize: 12,
    fontWeight: "bold",
  },
  activeHighContrast: {
    borderWidth: 2,
    borderColor: "#FFFF00",
  },
  activeDarkContrast: {
    borderWidth: 2,
    borderColor: "#F1C21B",
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#FFF0F0",
  },
  resetRowText: {
    color: "#DA1E28",
    fontWeight: "bold",
  },
});
