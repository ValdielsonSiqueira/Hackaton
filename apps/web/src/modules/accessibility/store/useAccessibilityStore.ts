import { create } from "zustand";
import type { UserSettings } from "@seniorease/core";
import { defaultSettings } from "@seniorease/core";
import { container } from "../../../shared/index";

interface AccessibilityState {
  settings: UserSettings;
  loading: boolean;
  loadSettings: () => Promise<UserSettings>;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
}

export const useAccessibilityStore = create<AccessibilityState>((set, get) => ({
  settings: defaultSettings,
  loading: true,

  loadSettings: async () => {
    try {
      const loaded = await container.manageSettingsUseCase.loadSettings();
      set({ settings: loaded, loading: false });
      return loaded;
    } catch (err) {
      set({ loading: false });
      return get().settings;
    }
  },

  updateSettings: async (newSettings: UserSettings) => {
    await container.manageSettingsUseCase.updateSettings(newSettings);
    set({ settings: newSettings });

    if (typeof document !== "undefined") {
      const root = document.documentElement;

      const scale = newSettings.fontScale || (newSettings.fontSizeScale === "large" ? 1.5 : newSettings.fontSizeScale === "medium" ? 1.25 : 1.0);
      root.style.setProperty("--font-scale", scale.toString());
      root.style.setProperty("--text-scale", scale.toString());

      let spaceScale = 1.0;
      if (newSettings.spacingScale === "large") spaceScale = 1.25;
      root.style.setProperty("--spacing-scale", spaceScale.toString());

      if (newSettings.contrastMode === "high") {
        root.classList.add("high-contrast");
        root.classList.remove("dark-contrast");
      } else if (newSettings.contrastMode === "dark") {
        root.classList.add("dark-contrast");
        root.classList.remove("high-contrast");
      } else {
        root.classList.remove("high-contrast", "dark-contrast");
      }

      if (newSettings.navigationMode === "simplified") {
        root.classList.add("simplified-mode");
      } else {
        root.classList.remove("simplified-mode");
      }
    }
  },
}));
