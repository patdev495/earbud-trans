import { LanguageCode } from '../types';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';

export interface STTResult {
  text: string;
  language: LanguageCode;
}

/**
 * Maps Groq's ISO-639-1 language tag to our LanguageCode domain type.
 * Falls back to 'vi' if unrecognized.
 */
function mapLanguage(detected: string | undefined): LanguageCode {
  if (!detected) return 'vi';
  const code = detected.toLowerCase().slice(0, 2);
  if (code === 'en') return 'en';
  if (code === 'zh' || code === 'zh') return 'zh';
  return 'vi';
}

/**
 * Transcribes an audio file URI using Groq Whisper Large-v3.
 * Automatically detects language (English, Vietnamese, Chinese).
 */
export async function transcribeAudio(audioUri: string): Promise<STTResult> {
  if (!GROQ_API_KEY) {
    throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not set in environment variables.');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    name: 'utterance.m4a',
    type: 'audio/m4a',
  } as unknown as Blob);
  formData.append('model', 'whisper-large-v3');
  formData.append('response_format', 'verbose_json');
  // No language specified — forces automatic multilingual detection

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();

  return {
    text: (data.text as string).trim(),
    language: mapLanguage(data.language as string | undefined),
  };
}
