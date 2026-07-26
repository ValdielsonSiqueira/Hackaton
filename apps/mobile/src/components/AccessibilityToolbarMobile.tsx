import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  PanResponder, 
  Dimensions 
} from "react-native";
import type { UserSettings } from "@seniorease/core";
import type { MobileThemeColors } from "../theme/mobileTheme";
import { 
  Eye, 
  Sun, 
  Moon, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Accessibility 
} from "lucide-react-native";

interface AccessibilityToolbarMobileProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  theme: { colors: MobileThemeColors; fontScale: number };
  topInset?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_WIDTH = 70;

export const AccessibilityToolbarMobile: React.FC<AccessibilityToolbarMobileProps> = ({
  settings,
  updateSettings,
  theme,
  topInset = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dockSide, setDockSide] = useState<"left" | "right">("right");

  const { colors, fontScale } = theme;
  const contrast = settings.contrastMode || "standard";
  const isHighContrast = contrast === "high";

  // Animated position for dragging
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: 120 + topInset })).current;
  const lastPosition = useRef({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: 120 + topInset });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: lastPosition.current.x,
          y: lastPosition.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_evt, gestureState) => {
        pan.flattenOffset();

        // Calculate final X and Y
        const currentX = lastPosition.current.x + gestureState.dx;
        const currentY = lastPosition.current.y + gestureState.dy;

        // Clamp Y to safe screen boundaries
        const clampedY = Math.max(60 + topInset, Math.min(SCREEN_HEIGHT - 160, currentY));

        // Determine snap to Left or Right edge
        const snapLeft = currentX + BUTTON_WIDTH / 2 < SCREEN_WIDTH / 2;
        const targetX = snapLeft ? 0 : SCREEN_WIDTH - BUTTON_WIDTH;
        const newDockSide = snapLeft ? "left" : "right";

        setDockSide(newDockSide);
        lastPosition.current = { x: targetX, y: clampedY };

        // Spring animate to docked edge
        Animated.spring(pan, {
          toValue: { x: targetX, y: clampedY },
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();

        // If tap gesture (minimal movement), open modal
        if (Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6) {
          setIsOpen(true);
        }
      },
    })
  ).current;

  const changeFontScale = async (delta: number) => {
    const currentScale = settings.fontScale || 1.0;
    const newScale = Math.max(0.8, Math.min(1.5, +(currentScale + delta).toFixed(1)));
    await updateSettings({ ...settings, fontScale: newScale });
  };

  const applyContrast = async (mode: "standard" | "high" | "dark") => {
    await updateSettings({ ...settings, contrastMode: mode });
  };

  const resetAll = async () => {
    await updateSettings({ ...settings, fontScale: 1.0, contrastMode: "standard" });
  };

  const badgeBg = isHighContrast ? "#000000" : "#24A148";
  const badgeBorderColor = isHighContrast ? "#FFFF00" : "transparent";
  const isLeft = dockSide === "left";

  return (
    <>
      {/* Draggable & Snap-to-Edge Floating Accessibility Button */}
      <Animated.View
        style={[
          styles.draggableContainer,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[
            styles.floatingTriggerBtn,
            isLeft ? styles.dockLeftBorderRadius : styles.dockRightBorderRadius,
            { backgroundColor: badgeBg, borderColor: badgeBorderColor, borderWidth: isHighContrast ? 2 : 0 },
          ]}
          onPress={() => setIsOpen(!isOpen)}
          accessibilityLabel="Abrir ferramentas de acessibilidade"
        >
          <Accessibility size={22} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          <Text style={[styles.floatingTriggerText, { color: isHighContrast ? "#FFFF00" : "#FFFFFF" }]}>
            ACESSÍVEL
          </Text>

          {isLeft ? (
            isOpen ? (
              <ChevronLeft size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
            ) : (
              <ChevronRight size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
            )
          ) : isOpen ? (
            <ChevronRight size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          ) : (
            <ChevronLeft size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Accessibility Drawer Modal */}
      <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={[styles.backdrop, isLeft && styles.backdropLeft]} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.drawerPanel,
              { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : "#24A148" },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Drawer Header */}
            <View style={[styles.drawerHeader, { backgroundColor: badgeBg }]}>
              <Text style={[styles.drawerTitle, { color: isHighContrast ? "#FFFF00" : "#FFFFFF" }]}>
                <Accessibility size={18} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} /> Acessibilidade
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={20} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>

            {/* A+ Font Scaling */}
            <TouchableOpacity style={[styles.drawerRow, { backgroundColor: colors.surfaceSubtle }]} onPress={() => changeFontScale(0.1)}>
              <Text style={[styles.drawerRowText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                A+ Aumentar Fonte
              </Text>
              <Text style={[styles.drawerRowSub, { color: colors.textMuted }]}>
                ({Math.round(fontScale * 100)}%)
              </Text>
            </TouchableOpacity>

            {/* A- Font Scaling */}
            <TouchableOpacity style={[styles.drawerRow, { backgroundColor: colors.surfaceSubtle }]} onPress={() => changeFontScale(-0.1)}>
              <Text style={[styles.drawerRowText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
                A- Diminuir Fonte
              </Text>
              <Text style={[styles.drawerRowSub, { color: colors.textMuted }]}>
                ({Math.round(fontScale * 100)}%)
              </Text>
            </TouchableOpacity>

            {/* High Contrast Mode */}
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

            {/* Dark Mode */}
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

            {/* Standard Mode */}
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

            {/* Reset Button */}
            <TouchableOpacity style={styles.resetRow} onPress={resetAll}>
              <RotateCcw size={18} color="#DA1E28" />
              <Text style={[styles.resetRowText, { fontSize: Math.round(15 * fontScale) }]}>
                Resetar Ajustes
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  floatingTriggerBtn: {
    width: BUTTON_WIDTH,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  dockRightBorderRadius: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  dockLeftBorderRadius: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  floatingTriggerText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 12,
  },
  backdropLeft: {
    alignItems: "flex-start",
    paddingLeft: 12,
    paddingRight: 0,
  },
  drawerPanel: {
    width: 290,
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    gap: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawerHeader: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  drawerTitle: {
    fontWeight: "bold",
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  drawerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 8,
  },
  drawerRowText: {
    fontWeight: "bold",
    flex: 1,
  },
  drawerRowSub: {
    fontSize: 12,
  },
  activeHighContrast: {
    borderColor: "#FFFF00",
    borderWidth: 2,
  },
  activeDarkContrast: {
    borderColor: "#F1C21B",
    borderWidth: 2,
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFF0F0",
    borderColor: "#DA1E28",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  resetRowText: {
    color: "#DA1E28",
    fontWeight: "bold",
  },
});
