import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { transcribeAudio, STTResult } from '../services/groqSTT';

export type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

interface UseAudioRecorderResult {
  recordingState: RecordingState;
  errorMessage: string | null;
  startRecording: () => Promise<void>;
  stopAndTranscribe: () => Promise<STTResult | null>;
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage(null);

      // Request microphone permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setErrorMessage('Cần cấp quyền truy cập microphone để thu âm.');
        setRecordingState('error');
        return;
      }

      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording with high-quality preset
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setRecordingState('recording');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi bắt đầu thu âm.';
      setErrorMessage(msg);
      setRecordingState('error');
    }
  }, []);

  const stopAndTranscribe = useCallback(async (): Promise<STTResult | null> => {
    if (!recordingRef.current || recordingState !== 'recording') return null;

    try {
      setRecordingState('processing');

      // Stop and unload the recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Reset audio mode back to playback
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (!uri) throw new Error('Không lấy được file ghi âm.');

      // Send to Groq Whisper for transcription + language detection
      const result = await transcribeAudio(uri);
      setRecordingState('idle');
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi phiên âm.';
      setErrorMessage(msg);
      setRecordingState('error');
      recordingRef.current = null;
      return null;
    }
  }, [recordingState]);

  return { recordingState, errorMessage, startRecording, stopAndTranscribe };
}
