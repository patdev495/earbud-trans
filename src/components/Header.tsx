import React from 'react';
import { View, Text } from 'react-native';
import { Headphones, Radio, Sparkles } from 'lucide-react-native';

interface HeaderProps {
  isBluetoothConnected: boolean;
  isListening: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isBluetoothConnected, isListening }) => {
  return (
    <View className="px-5 pt-3 pb-4 border-b border-slate-800 bg-slate-900/90">
      <View className="flex-row items-center justify-between">
        {/* Title & Branding */}
        <View className="flex-row items-center gap-2.5">
          <View className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center">
            <Sparkles size={20} color="#38BDF8" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg tracking-tight">Earbuds Live</Text>
            <Text className="text-slate-400 text-xs">Realtime Multilingual STT</Text>
          </View>
        </View>

        {/* Live Status Indicators */}
        <View className="flex-row items-center gap-2">
          {/* Bluetooth Status Badge */}
          <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800 border border-slate-700/80">
            <Headphones size={13} color={isBluetoothConnected ? "#38BDF8" : "#94A3B8"} />
            <Text className="text-xs font-medium text-slate-300">
              {isBluetoothConnected ? "Earbuds" : "Mic máy"}
            </Text>
          </View>

          {/* Listening State Pill */}
          <View className={`flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full ${isListening ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-slate-800 border border-slate-700/80'}`}>
            <Radio size={13} color={isListening ? "#10B981" : "#64748B"} />
            <Text className={`text-xs font-semibold ${isListening ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isListening ? "LIVE" : "SẴN SÀNG"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
