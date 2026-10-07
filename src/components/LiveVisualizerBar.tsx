import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Mic, MicOff, Volume2, Loader } from 'lucide-react-native';
import { RecordingState } from '../hooks/useAudioRecorder';

interface LiveVisualizerBarProps {
  recordingState: RecordingState;
  errorMessage: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const STATE_META: Record<RecordingState, { label: string; sublabel: string; dotColor: string }> = {
  idle: {
    label: 'Sẵn sàng lắng nghe',
    sublabel: 'Bấm nút để bắt đầu thu âm',
    dotColor: 'bg-slate-500',
  },
  recording: {
    label: 'Đang thu âm...',
    sublabel: 'Tự động nhận diện Anh / Việt / Trung',
    dotColor: 'bg-emerald-400',
  },
  processing: {
    label: 'Đang xử lý với Groq AI...',
    sublabel: 'Whisper Large-v3 đang phiên âm',
    dotColor: 'bg-sky-400',
  },
  error: {
    label: 'Đã xảy ra lỗi',
    sublabel: 'Bấm nút để thử lại',
    dotColor: 'bg-rose-500',
  },
};

export const LiveVisualizerBar: React.FC<LiveVisualizerBarProps> = ({
  recordingState,
  errorMessage,
  onStartRecording,
  onStopRecording,
}) => {
  const meta = STATE_META[recordingState];
  const isRecording = recordingState === 'recording';
  const isProcessing = recordingState === 'processing';
  const isDisabled = isProcessing;

  return (
    <View className="p-4 bg-slate-900/95 border-t border-slate-800">
      {/* Error message */}
      {errorMessage && (
        <View className="mb-2.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <Text className="text-xs text-rose-400">{errorMessage}</Text>
        </View>
      )}

      {/* Status Card */}
      <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-3">
        <View className="flex-row items-center gap-3">
          <View className={`w-3 h-3 rounded-full ${meta.dotColor}`} />
          <View>
            <Text className="text-sm font-semibold text-slate-200">{meta.label}</Text>
            <Text className="text-xs text-slate-400">{meta.sublabel}</Text>
          </View>
        </View>
        {isProcessing
          ? <ActivityIndicator size="small" color="#38BDF8" />
          : <Volume2 size={20} color={isRecording ? '#38BDF8' : '#64748B'} />
        }
      </View>

      {/* Main Action Button */}
      <TouchableOpacity
        onPress={isRecording ? onStopRecording : onStartRecording}
        activeOpacity={0.8}
        disabled={isDisabled}
        className={`h-14 rounded-2xl flex-row items-center justify-center gap-2.5 shadow-lg ${
          isDisabled
            ? 'bg-slate-700 border border-slate-600 opacity-60'
            : isRecording
            ? 'bg-rose-500/20 border border-rose-500/40'
            : 'bg-sky-500 border border-sky-400'
        }`}
      >
        {isProcessing ? (
          <>
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-slate-400 font-bold text-base">Đang xử lý...</Text>
          </>
        ) : isRecording ? (
          <>
            <MicOff size={20} color="#F43F5E" />
            <Text className="text-rose-400 font-bold text-base">Dừng & Phiên Âm</Text>
          </>
        ) : (
          <>
            <Mic size={20} color="#0F172A" />
            <Text className="text-slate-950 font-bold text-base">Bắt Đầu Thu Âm</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
