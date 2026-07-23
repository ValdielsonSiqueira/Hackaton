export const colors = {
  light: {
    background: "#F9F9F9", // Off-white/f9f9f9 to eliminate harsh glare
    surface: "#F9F9F9",
    text: "#1A1C1C", // on-surface
    primary: "#041627", // Deep Navy (main buttons, headers, borders)
    primaryContrast: "#FFFFFF",
    secondary: "#36693d", // Forest Green (positive proceed actions)
    secondaryContrast: "#FFFFFF",
    border: "#CBD5E1",
    
    // Material style containers from DESIGN.md
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F3F3F3",
    surfaceContainer: "#EEEEEE",
    surfaceContainerHigh: "#E8E8E8",
    surfaceContainerHighest: "#E2E2E2",
    onSurfaceVariant: "#44474C",
    outlineVariant: "#C4C6CD",
    
    // Alerts/Tertiary
    tertiaryContainer: "#432100",
    onTertiaryContainer: "#DA7807", // Amber warning
    error: "#BA1A1A",
    onError: "#FFFFFF"
  },
  dark: {
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F8FAFC",
    primary: "#3B82F6",
    primaryContrast: "#000000",
    secondary: "#10B981",
    secondaryContrast: "#FFFFFF",
    border: "#334155",
    surfaceContainerLowest: "#0F172A",
    surfaceContainerLow: "#1E293B",
    surfaceContainer: "#1E293B",
    surfaceContainerHigh: "#1E293B",
    surfaceContainerHighest: "#1E293B",
    onSurfaceVariant: "#94A3B8",
    outlineVariant: "#475569",
    tertiaryContainer: "#432100",
    onTertiaryContainer: "#DA7807",
    error: "#BA1A1A",
    onError: "#FFFFFF"
  },
  highContrast: {
    background: "#000000",
    surface: "#000000",
    text: "#FFFF00", // Yellow on black for extreme legibility
    primary: "#FFFF00",
    primaryContrast: "#000000",
    secondary: "#FFFF00",
    secondaryContrast: "#000000",
    border: "#FFFFFF",
    surfaceContainerLowest: "#000000",
    surfaceContainerLow: "#000000",
    surfaceContainer: "#000000",
    surfaceContainerHigh: "#000000",
    surfaceContainerHighest: "#000000",
    onSurfaceVariant: "#FFFF00",
    outlineVariant: "#FFFFFF",
    tertiaryContainer: "#000000",
    onTertiaryContainer: "#FFFF00",
    error: "#FF0000",
    onError: "#FFFFFF"
  }
};
export type ColorTheme = typeof colors.light;
