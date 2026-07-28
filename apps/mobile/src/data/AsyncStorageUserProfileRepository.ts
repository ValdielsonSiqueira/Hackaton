import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  name: string;
  email: string;
  caregiverContact: string;
  isAuthenticated: boolean;
}

export interface UserProfileRepository {
  getProfile(): Promise<UserProfile | null>;
  saveProfile(profile: UserProfile): Promise<void>;
}

export class AsyncStorageUserProfileRepository implements UserProfileRepository {
  private STORAGE_KEY = "seniorease_user_profile";

  async getProfile(): Promise<UserProfile | null> {
    try {
      const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {}
  }
}
