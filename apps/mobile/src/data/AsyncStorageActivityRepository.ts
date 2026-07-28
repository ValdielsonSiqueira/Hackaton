import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TaskStep {
  id: number;
  text: string;
  done: boolean;
}

export interface MobileTaskItem {
  id: string;
  title: string;
  category: string;
  due: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  steps?: TaskStep[];
}

export interface ActivityRepository {
  getActivities(): Promise<MobileTaskItem[]>;
  saveActivities(activities: MobileTaskItem[]): Promise<void>;
}

export class AsyncStorageActivityRepository implements ActivityRepository {
  private STORAGE_KEY = "seniorease_activities";

  async getActivities(): Promise<MobileTaskItem[]> {
    try {
      const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  async saveActivities(activities: MobileTaskItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
    } catch (err) {}
  }
}
