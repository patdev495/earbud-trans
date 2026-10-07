import { useState, useCallback, useRef, useEffect } from 'react';
import {
  AudioModule,
  type AudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { transcribeAudio, STTResult } from '../services/groqSTT';

export type Mode = 'manual' | 'handsfree';
export type Sensitivity = 'low' | 'medium' | 'high';
export type RecordingStatusState = 'idle' | 'listening' | 'speaking' | 'processing' | 'error';

interface UseHandsfreeTranslatorProps {
  onNewUtterance: (result: STTResult) => void;
}

interface UseHandsfreeTranslatorResult {
  mode: Mode;
  setMode: (mode: Mode) => void;
  sensitivity: Sensitivity;
  setSensitivity: (sens: Sensitivity) => void;
  status: RecordingStatusState;
  errorMessage: string | null;
  audioLevel: number; // 0 to 1 for visualizer
  isHandsfreeActive: boolean;
  pendingTasksCount: number;
  startManualRecording: () => Promise<void>;
  stopManualRecording: () => Promise<void>;
  toggleHandsfree: () => Promise<void>;
}

// Sensitivity thresholds (dB):
// Low (Chống ồn cao): Chỉ nhận giọng nói rõ gần mic (-26dB)
// Medium (Tiêu chuẩn): Cân bằng (-34dB)
// High (Nhạy): Bắt cả giọng nói nhỏ / phòng yên tĩnh (-42dB)
const SENSITIVITY_THRESHOLDS: Record<Sensitivity, number> = {
  low: -26,
  medium: -34,
  high: -42,
};

const SILENCE_TIMEOUT_MS = 400; // Fast silence cutoff (~400ms) for snappy sentence dispatch
const MIN_SPEECH_DURATION_MS = 250; // Minimum speech duration to capture short words (>=250ms)
const MAX_UTTERANCE_MS = 6000; // Auto-chunk after 6s continuous speech for live streaming feel
const POLL_INTERVAL_MS = 50; // Fast polling (20 checks/sec) for real-time responsiveness
const REQUIRED_CONSECUTIVE_FRAMES = 2; // ~100ms of sustained voice energy to filter impulse clicks

let segmentCounter = 1;

/**
 * Filters out common Whisper noise hallucination artifacts or bracketed sounds
 */
function isValidSpeechText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2) return false;

  // Filter bracketed noise indicators e.g. [Tiếng thở], (Music), [Laughter]
  if (/^\[.*\]$/.test(trimmed) || /^\(.*\)$/.test(trimmed)) return false;

  // Filter common repetitive Whisper hallucinations on silent noise
  const lower = trimmed.toLowerCase();
  const hallucinations = [
    'thank you',
    'thanks for watching',
    'subtitles by',
    'mbc 뉴스',
    'tiếng thở',
    'tiếng ồn',
    'âm nhạc',
    'applause',
    'you',
  ];
  if (hallucinations.some(h => lower === h || lower === `${h}.`)) return false;

  return true;
}

export function useHandsfreeTranslator({ onNewUtterance }: UseHandsfreeTranslatorProps): UseHandsfreeTranslatorResult {
  const [mode, setMode] = useState<Mode>('handsfree');
  const [sensitivity, setSensitivity] = useState<Sensitivity>('medium');
  const [status, setStatus] = useState<RecordingStatusState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isHandsfreeActive, setIsHandsfreeActive] = useState<boolean>(false);
  const [pendingTasksCount, setPendingTasksCount] = useState<number>(0);

  const activeRecorderRef = useRef<AudioRecorder | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handsfreeRunningRef = useRef<boolean>(false);
  const onNewUtteranceRef = useRef(onNewUtterance);
  onNewUtteranceRef.current = onNewUtterance;
  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

  // VAD state trackers
  const speechStartedAtRef = useRef<number | null>(null);
  const lastSpeechAtRef = useRef<number | null>(null);
  const segmentStartedAtRef = useRef<number>(0);
  const consecutiveVoiceFramesRef = useRef<number>(0);
  const isSegmentingRef = useRef<boolean>(false);

  // Helper to normalize dB (-60dB to 0dB) into 0..1 range
  const normalizeDb = (db?: number): number => {
    if (db === undefined || isNaN(db)) return 0;
    const clamped = Math.max(-60, Math.min(0, db));
    return (clamped + 60) / 60;
  };

  const ensurePermissions = async (): Promise<boolean> => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      setErrorMessage('Cần cấp quyền truy cập microphone để phiên âm.');
      setStatus('error');
      return false;
    }
    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    return true;
  };

  // Dispatch an isolated audio file asynchronously to Groq Whisper in the background
  const dispatchToGroq = useCallback(async (sourceUri: string) => {
    setPendingTasksCount(prev => prev + 1);

    const uniqueFile = `${FileSystem.cacheDirectory}segment_${Date.now()}_${segmentCounter++}.m4a`;

    try {
      await FileSystem.copyAsync({
        from: sourceUri,
        to: uniqueFile,
      });

      const result = await transcribeAudio(uniqueFile);
      if (result.text && isValidSpeechText(result.text)) {
        onNewUtteranceRef.current(result);
      }
    } catch (err) {
      console.warn('Transcription error:', err);
    } finally {
      try {
        await FileSystem.deleteAsync(uniqueFile, { idempotent: true });
      } catch (_) {}
      setPendingTasksCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  // Create and start a fresh audio recorder instance
  const createAndStartRecorder = async (): Promise<AudioRecorder | null> => {
    try {
      const recorder = new AudioModule.AudioRecorder({
        ...RecordingPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      segmentStartedAtRef.current = Date.now();
      speechStartedAtRef.current = null;
      lastSpeechAtRef.current = null;
      consecutiveVoiceFramesRef.current = 0;
      return recorder;
    } catch (err) {
      console.error('Failed to create recorder:', err);
      return null;
    }
  };

  // Process and cycle to a new audio segment immediately in hands-free mode
  const cycleSegment = async (shouldTranscribe: boolean) => {
    if (isSegmentingRef.current) return;
    isSegmentingRef.current = true;

    const oldRecorder = activeRecorderRef.current;
    if (!oldRecorder) {
      isSegmentingRef.current = false;
      return;
    }

    try {
      await oldRecorder.stop();
      const uri = oldRecorder.uri;

      if (handsfreeRunningRef.current) {
        const nextRecorder = await createAndStartRecorder();
        activeRecorderRef.current = nextRecorder;
      } else {
        activeRecorderRef.current = null;
      }

      if (shouldTranscribe && uri) {
        dispatchToGroq(uri);
      }
    } catch (err) {
      console.warn('Error cycling segment:', err);
    } finally {
      isSegmentingRef.current = false;
    }
  };

  // Smart VAD Loop with Continuous Energy Verification
  const vadTick = useCallback(async () => {
    const recorder = activeRecorderRef.current;
    if (!recorder || !recorder.isRecording) return;

    const state = recorder.getStatus();
    const db = state.metering;
    const normLevel = normalizeDb(db);
    setAudioLevel(normLevel);

    const threshold = SENSITIVITY_THRESHOLDS[sensitivityRef.current];
    const now = Date.now();
    const duration = now - segmentStartedAtRef.current;
    const isLevelAbove = db !== undefined && db >= threshold;

    if (isLevelAbove) {
      consecutiveVoiceFramesRef.current += 1;

      // Only qualify as human speech if energy is sustained across consecutive frames
      if (consecutiveVoiceFramesRef.current >= REQUIRED_CONSECUTIVE_FRAMES) {
        if (!speechStartedAtRef.current) {
          speechStartedAtRef.current = now;
        }
        lastSpeechAtRef.current = now;
        setStatus('speaking');
      }
    } else {
      consecutiveVoiceFramesRef.current = 0;

      if (speechStartedAtRef.current) {
        const silenceDuration = lastSpeechAtRef.current ? now - lastSpeechAtRef.current : 0;
        const totalSpeechDuration = lastSpeechAtRef.current ? lastSpeechAtRef.current - speechStartedAtRef.current : 0;

        if (silenceDuration >= SILENCE_TIMEOUT_MS) {
          if (totalSpeechDuration >= MIN_SPEECH_DURATION_MS) {
            setStatus('listening');
            await cycleSegment(true);
          } else {
            // Impulse click / brief sound -> reset without dispatching
            setStatus('listening');
            await cycleSegment(false);
          }
          return;
        }
      } else {
        setStatus('listening');
        if (duration >= MAX_UTTERANCE_MS) {
          await cycleSegment(false);
        }
      }
    }

    if (speechStartedAtRef.current && duration >= MAX_UTTERANCE_MS) {
      await cycleSegment(true);
    }
  }, [dispatchToGroq]);

  // Start Hands-free VAD mode
  const startHandsfree = async () => {
    setErrorMessage(null);
    const hasPerm = await ensurePermissions();
    if (!hasPerm) return;

    handsfreeRunningRef.current = true;
    setIsHandsfreeActive(true);
    setStatus('listening');

    const recorder = await createAndStartRecorder();
    activeRecorderRef.current = recorder;

    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(vadTick, POLL_INTERVAL_MS);
  };

  // Stop Hands-free VAD mode
  const stopHandsfree = async () => {
    handsfreeRunningRef.current = false;
    setIsHandsfreeActive(false);
    setStatus('idle');
    setAudioLevel(0);

    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (activeRecorderRef.current) {
      try {
        await activeRecorderRef.current.stop();
      } catch (_) {}
      activeRecorderRef.current = null;
    }

    await setAudioModeAsync({ allowsRecording: false });
  };

  const toggleHandsfree = async () => {
    if (isHandsfreeActive) {
      await stopHandsfree();
    } else {
      await startHandsfree();
    }
  };

  // Manual Mode handlers
  const startManualRecording = async () => {
    setErrorMessage(null);
    const hasPerm = await ensurePermissions();
    if (!hasPerm) return;

    setStatus('speaking');
    const recorder = await createAndStartRecorder();
    activeRecorderRef.current = recorder;
  };

  const stopManualRecording = async () => {
    const recorder = activeRecorderRef.current;
    if (!recorder) return;

    setStatus('processing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      activeRecorderRef.current = null;
      await setAudioModeAsync({ allowsRecording: false });

      if (uri) {
        await dispatchToGroq(uri);
      }
      setStatus('idle');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi phiên âm.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handsfreeRunningRef.current = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (activeRecorderRef.current) {
        activeRecorderRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return {
    mode,
    setMode,
    sensitivity,
    setSensitivity,
    status,
    errorMessage,
    audioLevel,
    isHandsfreeActive,
    pendingTasksCount,
    startManualRecording,
    stopManualRecording,
    toggleHandsfree,
  };
}
