export interface UserProfile {
  name: string;
  email: string;
  caregiverContact: string;
  isAuthenticated: boolean;
}

export interface UserProfileRepository {
  getUserProfile(): Promise<UserProfile>;
  saveUserProfile(profile: UserProfile): Promise<void>;
}

export class LocalStorageUserProfileRepository implements UserProfileRepository {
  private STORAGE_KEY = "seniorease_user_profile";

  async getUserProfile(): Promise<UserProfile> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return { name: "", email: "", caregiverContact: "", isAuthenticated: false };
      const parsed = JSON.parse(raw);
      return {
        name: parsed.name || "",
        email: parsed.email || "",
        caregiverContact: parsed.caregiverContact || "",
        isAuthenticated: Boolean(parsed.isAuthenticated),
      };
    } catch (e) {
      return { name: "", email: "", caregiverContact: "", isAuthenticated: false };
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save user profile to localStorage", e);
    }
  }
}
