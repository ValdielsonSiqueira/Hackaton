import { describe, it, expect, beforeEach, vi } from "vitest";

const mockStorage: Record<string, string> = {};

vi.mock("react-native", () => ({
  Modal: () => null,
  StyleSheet: { create: (s: any) => s },
  Text: () => null,
  View: () => null,
  TouchableOpacity: () => null,
  ScrollView: () => null,
}));

vi.mock("lucide-react-native", () => ({
  X: () => null,
  Volume2: () => null,
  ArrowRight: () => null,
  ArrowLeft: () => null,
  Check: () => null,
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    setItem: vi.fn(async (key: string, value: string) => {
      mockStorage[key] = value;
    }),
    getItem: vi.fn(async (key: string) => mockStorage[key] || null),
    clear: vi.fn(async () => {
      for (const k in mockStorage) delete mockStorage[k];
    }),
  },
}));

import { isMobileTourCompleted, markMobileTourCompleted } from "../components/MobileTourModal";

describe("Mobile Tour Persistence Utilities", () => {
  beforeEach(() => {
    for (const k in mockStorage) delete mockStorage[k];
  });

  it("should return false when tour is not yet completed", async () => {
    const completed = await isMobileTourCompleted();
    expect(completed).toBe(false);
  });

  it("should mark mobile tour as completed and persist status", async () => {
    await markMobileTourCompleted();
    const completed = await isMobileTourCompleted();
    expect(completed).toBe(true);
  });
});
