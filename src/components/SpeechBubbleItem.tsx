import React from 'react';
import { View, Text } from 'react-native';
import { Utterance, LanguageCode } from '../types';

interface SpeechBubbleItemProps {
  utterance: Utterance;
}

const LANGUAGE_META: Record<LanguageCode, { label: string; name: string; bg: string; text: string; border: string }> = {
  vi: {
    label: 'VI',
    name: 'Tiếng Việt',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  },
  en: {
    label: 'EN',
    name: 'English',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30'
  },
  zh: {
    label: 'ZH',
    name: '中文',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  }
};

export const SpeechBubbleItem: React.FC<SpeechBubbleItemProps> = ({ utterance }) => {
  const meta = LANGUAGE_META[utterance.language] || LANGUAGE_META.vi;
  const timeFormatted = new Date(utterance.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View className="mb-3.5 mx-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-md">
      {/* Top Meta Bar */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-2">
          {/* Language Badge */}
          <View className={`px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.border}`}>
            <Text className={`text-xs font-bold tracking-wider ${meta.text}`}>
              {meta.label}
            </Text>
          </View>
          <Text className="text-xs text-slate-400 font-medium">
            {meta.name}
          </Text>
        </View>

        {/* Timestamp */}
        <Text className="text-xs text-slate-500 font-mono">
          {timeFormatted}
        </Text>
      </View>

      {/* Transcription Text Content */}
      <Text className="text-slate-100 text-base leading-6 font-normal">
        {utterance.text}
      </Text>
    </View>
  );
};
