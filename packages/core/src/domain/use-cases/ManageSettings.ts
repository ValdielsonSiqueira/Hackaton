import { UserSettings, defaultSettings } from "../entities/UserSettings.js";
import { SettingsRepository } from "../repositories/SettingsRepository.js";

export class ManageSettings {
  constructor(private settingsRepo: SettingsRepository) {}

  async loadSettings(): Promise<UserSettings> {
    try {
      const settings = await this.settingsRepo.getSettings();
      return settings || defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  async updateSettings(settings: UserSettings): Promise<void> {
    await this.settingsRepo.saveSettings(settings);
  }
}
