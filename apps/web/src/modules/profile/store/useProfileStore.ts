import { create } from "zustand";
import type { UserProfile } from "../../../data/LocalStorageUserProfileRepository";
import { container } from "../../../shared/index";

interface ProfileState {
  userProfile: UserProfile;
  loading: boolean;
  loadUserProfile: () => Promise<UserProfile>;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  userProfile: { name: "", email: "", caregiverContact: "", isAuthenticated: false },
  loading: true,

  loadUserProfile: async () => {
    try {
      const loaded = await container.userProfileRepository.getUserProfile();
      set({ userProfile: loaded, loading: false });
      return loaded;
    } catch (err) {
      set({ loading: false });
      return get().userProfile;
    }
  },

  updateUserProfile: async (partial: Partial<UserProfile>) => {
    const updated = { ...get().userProfile, ...partial };
    await container.userProfileRepository.saveUserProfile(updated);
    set({ userProfile: updated });
  },
}));
