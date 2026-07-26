export interface PhoneSupportConfig {
  phoneNumber: string;
  formattedDisplay: string;
}

export const DEFAULT_SUPPORT_CONFIG: PhoneSupportConfig = {
  phoneNumber: "08007008000",
  formattedDisplay: "0800 700 8000",
};

export class PhoneSupportService {
  private config: PhoneSupportConfig;

  constructor(config: PhoneSupportConfig = DEFAULT_SUPPORT_CONFIG) {
    this.config = config;
  }

  getFormattedPhone(): string {
    return this.config.formattedDisplay;
  }

  initiateSupportCall(onSuccess?: (msg: string) => void): void {
    const msg = `Iniciando atendimento de suporte pelo número ${this.config.formattedDisplay}...`;
    if (typeof window !== "undefined" && window.location) {
      try {
        window.location.href = `tel:${this.config.phoneNumber}`;
      } catch (e) {}
    }
    if (onSuccess) onSuccess(msg);
  }
}

export const phoneSupportService = new PhoneSupportService();
