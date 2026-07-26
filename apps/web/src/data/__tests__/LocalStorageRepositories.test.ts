import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageUserProfileRepository } from "../LocalStorageUserProfileRepository";
import { LocalStorageActivityRepository } from "../LocalStorageActivityRepository";
import type { TaskItem } from "../../context/AppContext";

describe("Clean Arch Repositories Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("LocalStorageUserProfileRepository", () => {
    it("should return default profile if nothing is stored", async () => {
      const repo = new LocalStorageUserProfileRepository();
      const profile = await repo.getUserProfile();
      expect(profile).toEqual({
        name: "",
        email: "",
        caregiverContact: "",
        isAuthenticated: false,
      });
    });

    it("should save and retrieve user profile accurately", async () => {
      const repo = new LocalStorageUserProfileRepository();
      const sampleProfile = {
        name: "Maria Silva",
        email: "maria@exemplo.com",
        caregiverContact: "João (Filho) - 11 99999-8888",
        isAuthenticated: true,
      };

      await repo.saveUserProfile(sampleProfile);
      const retrieved = await repo.getUserProfile();

      expect(retrieved).toEqual(sampleProfile);
    });
  });

  describe("LocalStorageActivityRepository", () => {
    it("should return empty list if no activities stored", async () => {
      const repo = new LocalStorageActivityRepository();
      const activities = await repo.getActivities();
      expect(activities).toEqual([]);
    });

    it("should save and retrieve activity tasks accurately", async () => {
      const repo = new LocalStorageActivityRepository();
      const sampleActivities: TaskItem[] = [
        {
          id: "task-1",
          title: "Ler capítulo 1 de UX Design",
          category: "LEITURA",
          due: "HOJE 18:00",
          done: false,
          priority: "high",
        },
      ];

      await repo.saveActivities(sampleActivities);
      const retrieved = await repo.getActivities();

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].title).toBe("Ler capítulo 1 de UX Design");
    });
  });
});
