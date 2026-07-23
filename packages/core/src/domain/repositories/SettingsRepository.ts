import { UserSettings } from "../entities/UserSettings.js";

export interface SettingsRepository {
  getSettings(): Promise<UserSettings | null>;
  saveSettings(settings: UserSettings): Promise<void>;
}
