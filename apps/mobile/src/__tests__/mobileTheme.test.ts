import { describe, it, expect } from "vitest";
import { getMobileTheme } from "../theme/mobileTheme";
import type { UserSettings } from "@seniorease/core";

const createDefaultSettings = (overrides?: Partial<UserSettings>): UserSettings => ({
  fontSizeScale: "standard",
  spacingScale: "standard",
  contrastMode: "standard",
  navigationMode: "standard",
  feedbackVisual: true,
  criticalConfirmation: true,
  fontScale: 1.0,
  ...overrides,
});

describe("Mobile Theme Utility (getMobileTheme)", () => {
  it("should return standard light theme colors by default", () => {
    const settings = createDefaultSettings({
      contrastMode: "standard",
      fontScale: 1.0,
    });
    const theme = getMobileTheme(settings);

    expect(theme.fontScale).toBe(1.0);
    expect(theme.colors.mode).toBe("standard");
    expect(theme.colors.primary).toBe("#0F62FE");
    expect(theme.colors.borderWidth).toBe(1);
  });

  it("should return WCAG AAA High Contrast theme colors when contrastMode is high", () => {
    const settings = createDefaultSettings({
      contrastMode: "high",
      fontScale: 1.5,
    });
    const theme = getMobileTheme(settings);

    expect(theme.fontScale).toBe(1.5);
    expect(theme.colors.mode).toBe("high");
    expect(theme.colors.background).toBe("#000000");
    expect(theme.colors.text).toBe("#FFFF00");
    expect(theme.colors.border).toBe("#FFFF00");
    expect(theme.colors.borderWidth).toBe(2);
  });

  it("should return dark graphite theme colors when contrastMode is dark", () => {
    const settings = createDefaultSettings({
      contrastMode: "dark",
      fontScale: 1.2,
    });
    const theme = getMobileTheme(settings);

    expect(theme.fontScale).toBe(1.2);
    expect(theme.colors.mode).toBe("dark");
    expect(theme.colors.pending).toBe("#F1C21B");
    expect(theme.colors.card).toBe("#1E293B");
  });

  it("should infer fontScale from fontSizeScale if fontScale is undefined", () => {
    const largeSettings = createDefaultSettings({
      contrastMode: "standard",
      fontSizeScale: "large",
      fontScale: undefined,
    });
    const largeTheme = getMobileTheme(largeSettings);
    expect(largeTheme.fontScale).toBe(1.4);

    const standardSettings = createDefaultSettings({
      contrastMode: "standard",
      fontSizeScale: "standard",
      fontScale: undefined,
    });
    const standardTheme = getMobileTheme(standardSettings);
    expect(standardTheme.fontScale).toBe(1.0);
  });
});
