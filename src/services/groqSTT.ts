import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import { LanguageCode } from '../types';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';

export interface STTResult {
  text: string;
  language: LanguageCode;
  latencyMs?: number;
  durationSec?: number;
}

/**
 * Accurately detects language from Groq Whisper metadata and text content.
 * Fixes Groq's "chinese" -> "ch" tag mapping and uses Hanzi character detection.
 */
function detectLanguage(detectedLang: string | undefined, text: string): LanguageCode {
  // 1. Text-based content check (highest confidence for Chinese Hanzi)
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return 'zh';
  }

  // 2. Groq Whisper language tag mapping
  if (detectedLang) {
    const langLower = detectedLang.toLowerCase().trim();
    if (
      langLower.startsWith('zh') ||
      langLower.includes('chinese') ||
      langLower.includes('mandarin') ||
      langLower.includes('cantonese') ||
      langLower === 'cmn' ||
      langLower === 'yue'
    ) {
      return 'zh';
    }
    if (langLower.startsWith('en') || langLower.includes('english')) {
      return 'en';
    }
    if (langLower.startsWith('vi') || langLower.includes('vietnamese')) {
      return 'vi';
    }
  }

  // 3. Text-based Vietnamese diacritic check
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) {
    return 'vi';
  }

  return 'en';
}

/**
 * Transcribes an audio file URI using Groq Whisper Large-v3.
 * Automatically detects language (English, Vietnamese, Chinese).
 * Uses native multipart upload to avoid Hermes / React Native FormData limitations.
 */
export async function transcribeAudio(audioUri: string): Promise<STTResult> {
  if (!GROQ_API_KEY) {
    throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not set in environment variables.');
  }

  const startTime = Date.now();

  const uploadResult = await uploadAsync(GROQ_ENDPOINT, audioUri, {
    httpMethod: 'POST',
    uploadType: FileSystemUploadType.MULTIPART,
    fieldName: 'file',
    mimeType: 'audio/m4a',
    parameters: {
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
    },
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
  });

  const latencyMs = Date.now() - startTime;

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    throw new Error(`Groq API error ${uploadResult.status}: ${uploadResult.body}`);
  }

  const data = JSON.parse(uploadResult.body);
  const rawText = (data.text as string || '').trim();
  const detectedLang = detectLanguage(data.language as string | undefined, rawText);

  return {
    text: rawText,
    language: detectedLang,
    latencyMs,
    durationSec: typeof data.duration === 'number' ? Math.round(data.duration * 10) / 10 : undefined,
  };
}
