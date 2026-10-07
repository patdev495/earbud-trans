export type LanguageCode = 'vi' | 'en' | 'zh';

export interface Utterance {
  id: string;
  text: string;
  language: LanguageCode;
  timestamp: number;
  confidence?: number;
}

export interface AudioSessionState {
  isListening: boolean;
  isProcessing: boolean;
  isBluetoothConnected: boolean;
  activeLanguage?: LanguageCode;
}
