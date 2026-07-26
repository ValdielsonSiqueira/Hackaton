import { tokens, type UserSettings } from "@seniorease/core";

export interface MobileThemeColors {
  background: string;
  surface: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryContrast: string;
  border: string;
  borderWidth: number;
  success: string;
  urgent: string;
  pending: string;
  card: string;
  mode: "standard" | "high" | "dark";
}

export function getMobileTheme(settings: UserSettings): {
  colors: MobileThemeColors;
  fontScale: number;
} {
  const contrast = settings.contrastMode || "standard";
  const fontScale = settings.fontScale || (settings.fontSizeScale === "large" ? 1.4 : settings.fontSizeScale === "medium" ? 1.2 : 1.0);

  if (contrast === "high") {
    return {
      fontScale,
      colors: {
        background: "#000000",
        surface: "#000000",
        surfaceSubtle: "#111111",
        text: "#FFFF00",
        textMuted: "#FFFF80",
        primary: "#FFFF00",
        primaryContrast: "#000000",
        border: "#FFFF00",
        borderWidth: 2,
        success: "#00FF00",
        urgent: "#FF0000",
        pending: "#FFFF00",
        card: "#000000",
        mode: "high",
      },
    };
  }

  if (contrast === "dark") {
    return {
      fontScale,
      colors: {
        background: tokens.colors.dark.background,
        surface: tokens.colors.dark.surface,
        surfaceSubtle: "#262626",
        text: tokens.colors.dark.text,
        textMuted: "#A8A8A8",
        primary: tokens.colors.dark.primary,
        primaryContrast: tokens.colors.dark.primaryContrast,
        border: tokens.colors.dark.border,
        borderWidth: 1,
        success: "#42BE65",
        urgent: "#FF8389",
        pending: "#F1C21B",
        card: "#1E293B",
        mode: "dark",
      },
    };
  }

  return {
    fontScale,
    colors: {
      background: tokens.colors.light.background,
      surface: "#FFFFFF",
      surfaceSubtle: tokens.colors.light.surfaceContainerLow,
      text: tokens.colors.light.text,
      textMuted: tokens.colors.light.onSurfaceVariant,
      primary: "#0F62FE",
      primaryContrast: "#FFFFFF",
      border: tokens.colors.light.border,
      borderWidth: 1,
      success: "#24A148",
      urgent: "#DA1E28",
      pending: "#F1C21B",
      card: "#FFFFFF",
      mode: "standard",
    },
  };
}
