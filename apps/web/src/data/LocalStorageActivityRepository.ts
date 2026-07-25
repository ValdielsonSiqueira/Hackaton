import type { TaskItem } from "../context/AppContext";

export interface ActivityRepository {
  getActivities(): Promise<TaskItem[]>;
  saveActivities(activities: TaskItem[]): Promise<void>;
}

export class LocalStorageActivityRepository implements ActivityRepository {
  private STORAGE_KEY = "seniorease_activities";

  async getActivities(): Promise<TaskItem[]> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load activity tasks from localStorage", e);
      return [];
    }
  }

  async saveActivities(activities: TaskItem[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error("Failed to save activity tasks to localStorage", e);
    }
  }
}
