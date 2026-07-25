export interface VoiceRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (errorMsg: string) => void;
  onEnd?: () => void;
  lang?: string;
}

export class VoiceService {
  private recognition: any = null;

  isSupported(): boolean {
    return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }

  startListening(options: VoiceRecognitionOptions): boolean {
    if (!this.isSupported()) {
      if (options.onError) options.onError("Navegador não suporta gravação de voz");
      return false;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = options.lang || "pt-BR";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        options.onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        if (options.onError) options.onError(`Erro no microfone: ${event.error}`);
      };

      this.recognition.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      if (options.onError) options.onError(`Falha ao iniciar microfone: ${err.message || err}`);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
  }
}

export const voiceService = new VoiceService();
