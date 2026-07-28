import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  PanResponder, 
  Dimensions 
} from "react-native";
import { Accessibility, ChevronLeft, ChevronRight } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { UserSettings } from "@seniorease/core";
import { AccessibilityDrawerModal } from "./AccessibilityDrawerModal";

interface AccessibilityToolbarMobileProps {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  theme: { colors: MobileThemeColors; fontScale: number };
  topInset?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_WIDTH = 64;
const BUTTON_HEIGHT = 64;

export const AccessibilityToolbarMobile: React.FC<AccessibilityToolbarMobileProps> = ({
  settings,
  updateSettings,
  theme,
  topInset = 24,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeft, setIsLeft] = useState(false);

  const initialY = Math.max(topInset + 40, 100);

  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: initialY })).current;
  const lastPosition = useRef({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: initialY });

  const { colors, fontScale } = theme;
  const contrast = settings.contrastMode || "standard";
  const isHighContrast = contrast === "high";
  const badgeBg = isHighContrast ? "#000000" : "#24A148";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        const currentY = (pan.y as any)._value;
        const clampedY = Math.min(Math.max(currentY, topInset + 10), SCREEN_HEIGHT - BUTTON_HEIGHT - 60);

        const currentX = (pan.x as any)._value;
        const snapToLeft = currentX < SCREEN_WIDTH / 2;
        const targetX = snapToLeft ? 0 : SCREEN_WIDTH - BUTTON_WIDTH;

        setIsLeft(snapToLeft);

        Animated.spring(pan, {
          toValue: { x: targetX, y: clampedY },
          useNativeDriver: false,
          bounciness: 6,
        }).start();

        lastPosition.current = { x: targetX, y: clampedY };
      },
    })
  ).current;

  return (
    <>
      <Animated.View
        style={[
          styles.draggableContainer,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.floatingTriggerBtn,
            {
              backgroundColor: badgeBg,
              borderColor: isHighContrast ? colors.border : "transparent",
              borderWidth: isHighContrast ? 2 : 0,
              borderTopLeftRadius: isLeft ? 0 : 16,
              borderBottomLeftRadius: isLeft ? 0 : 16,
              borderTopRightRadius: isLeft ? 16 : 0,
              borderBottomRightRadius: isLeft ? 16 : 0,
            },
          ]}
          onPress={() => setIsOpen(!isOpen)}
          accessibilityRole="button"
          accessibilityLabel="Abrir gaveta de opções de acessibilidade. Pressione e arraste para mover."
        >
          <Accessibility size={22} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          <Text 
            numberOfLines={1} 
            adjustsFontSizeToFit 
            minimumFontScale={0.75}
            style={[styles.floatingTriggerText, { color: isHighContrast ? "#FFFF00" : "#FFFFFF", fontSize: Math.round(9 * fontScale) }]}
          >
            Acessível
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

      <AccessibilityDrawerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isLeft={isLeft}
        theme={theme}
        settings={settings}
        updateSettings={updateSettings}
      />
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingTriggerText: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
