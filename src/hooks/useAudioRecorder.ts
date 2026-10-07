import { useState, useCallback, useRef } from 'react';
import {
  useAudioRecorder as useExpoAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
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

  const audioRecorder = useExpoAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderRef = useRef(audioRecorder);
  recorderRef.current = audioRecorder;

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage(null);

      // Request microphone permissions
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        setErrorMessage('Cần cấp quyền truy cập microphone để thu âm.');
        setRecordingState('error');
        return;
      }

      // Configure audio mode for recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Prepare and start recording
      await recorderRef.current.prepareToRecordAsync();
      recorderRef.current.record();
      setRecordingState('recording');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi bắt đầu thu âm.';
      setErrorMessage(msg);
      setRecordingState('error');
    }
  }, []);

  const stopAndTranscribe = useCallback(async (): Promise<STTResult | null> => {
    try {
      setRecordingState('processing');

      // Stop recording
      await recorderRef.current.stop();
      const uri = recorderRef.current.uri;

      // Reset audio mode back
      await setAudioModeAsync({ allowsRecording: false });

      if (!uri) {
        throw new Error('Không lấy được file ghi âm.');
      }

      // Send to Groq Whisper for transcription + language detection
      const result = await transcribeAudio(uri);
      setRecordingState('idle');
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi phiên âm.';
      setErrorMessage(msg);
      setRecordingState('error');
      return null;
    }
  }, []);

  return { recordingState, errorMessage, startRecording, stopAndTranscribe };
}
