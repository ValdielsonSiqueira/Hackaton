export interface UserSettings {
  fontSizeScale: "standard" | "medium" | "large";
  contrastMode: "standard" | "high" | "dark";
  spacingScale: "standard" | "large";
  navigationMode: "standard" | "simplified";
  feedbackVisual: boolean;
  criticalConfirmation: boolean;
  fontScale?: number;
}

export const defaultSettings: UserSettings = {
  fontSizeScale: "medium",
  contrastMode: "standard",
  spacingScale: "standard",
  navigationMode: "simplified",
  feedbackVisual: true,
  criticalConfirmation: true,
  fontScale: 1.0
};
