import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';

interface LiveVisualizerBarProps {
  isListening: boolean;
  onToggleListening: () => void;
}

export const LiveVisualizerBar: React.FC<LiveVisualizerBarProps> = ({
  isListening,
  onToggleListening
}) => {
  return (
    <View className="p-4 bg-slate-900/95 border-t border-slate-800">
      {/* Visualizer Status Card */}
      <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-3">
        <View className="flex-row items-center gap-3">
          <View className={`w-3 h-3 rounded-full ${isListening ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          <View>
            <Text className="text-sm font-semibold text-slate-200">
              {isListening ? "Đang thu âm qua tai nghe" : "Tạm dừng lắng nghe"}
            </Text>
            <Text className="text-xs text-slate-400">
              {isListening ? "Tự động nhận diện Anh / Việt / Trung" : "Bấm nút bên dưới để bắt đầu"}
            </Text>
          </View>
        </View>

        {/* Wave Icon */}
        <Volume2 size={20} color={isListening ? "#38BDF8" : "#64748B"} />
      </View>

      {/* Main Action Button (Apple Touch Target >= 44pt) */}
      <TouchableOpacity
        onPress={onToggleListening}
        activeOpacity={0.8}
        className={`h-14 rounded-2xl flex-row items-center justify-center gap-2.5 shadow-lg ${
          isListening 
            ? 'bg-rose-500/20 border border-rose-500/40' 
            : 'bg-sky-500 border border-sky-400'
        }`}
      >
        {isListening ? (
          <>
            <MicOff size={20} color="#F43F5E" />
            <Text className="text-rose-400 font-bold text-base">Tạm Dừng Thu Âm</Text>
          </>
        ) : (
          <>
            <Mic size={20} color="#0F172A" />
            <Text className="text-slate-950 font-bold text-base">Bắt Đầu Thu Âm Rảnh Tay</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
