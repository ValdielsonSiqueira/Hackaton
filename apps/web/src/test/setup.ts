import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock SpeechSynthesis
if (typeof window !== "undefined") {
  (window as any).SpeechSynthesisUtterance = class {
    text: string;
    lang: string = "pt-BR";
    rate: number = 1.0;
    constructor(text: string) {
      this.text = text;
    }
  };

  (window as any).speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [],
  };
}
