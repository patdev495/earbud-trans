export type LanguageCode = 'vi' | 'en' | 'zh';

export interface Utterance {
  id: string;
  text: string;
  language: LanguageCode;
  timestamp: number;
  confidence?: number;
  latencyMs?: number;
  durationSec?: number;
  pinyin?: string;
}

export interface AudioSessionState {
  isListening: boolean;
  isProcessing: boolean;
  isBluetoothConnected: boolean;
  activeLanguage?: LanguageCode;
  apiStatus: 'ready' | 'offline' | 'error';
}
