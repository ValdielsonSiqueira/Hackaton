import * as Speech from "expo-speech";

export interface IVoiceService {
  speak(text: string): void;
  stop(): void;
}

export class ExpoSpeechVoiceService implements IVoiceService {
  speak(text: string): void {
    try {
      Speech.stop();
      Speech.speak(text, { language: "pt-BR", rate: 0.85 });
    } catch (e) {}
  }

  stop(): void {
    try {
      Speech.stop();
    } catch (e) {}
  }
}
