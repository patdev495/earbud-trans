import "./global.css";
import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { SpeechBubbleItem } from './src/components/SpeechBubbleItem';
import { LiveVisualizerBar } from './src/components/LiveVisualizerBar';
import { Utterance } from './src/types';

const INITIAL_MOCK_UTTERANCES: Utterance[] = [
  {
    id: '1',
    text: 'Xin chào, tôi đang đeo tai nghe Bluetooth và nói thử bằng tiếng Việt.',
    language: 'vi',
    timestamp: Date.now() - 25000,
  },
  {
    id: '2',
    text: 'This is a live test of English speech recognition streamed directly to the app.',
    language: 'en',
    timestamp: Date.now() - 18000,
  },
  {
    id: '3',
    text: '你好，这是一个实时中文语音识别测试，非常流畅。',
    language: 'zh',
    timestamp: Date.now() - 12000,
  },
  {
    id: '4',
    text: 'Ngôn ngữ được hệ thống AI tự động nhận diện mà không cần người dùng thao tác chọn trước.',
    language: 'vi',
    timestamp: Date.now() - 6000,
  },
  {
    id: '5',
    text: 'Hands-free voice recognition with sub-second response times ready for daily communication.',
    language: 'en',
    timestamp: Date.now() - 1000,
  }
];

export default function App() {
  const [utterances, setUtterances] = useState<Utterance[]>(INITIAL_MOCK_UTTERANCES);
  const [isListening, setIsListening] = useState<boolean>(true);
  const [isBluetoothConnected] = useState<boolean>(true);

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-900" edges={['top', 'left', 'right']}>
        <StatusBar style="light" />

        {/* App Header */}
        <Header 
          isBluetoothConnected={isBluetoothConnected} 
          isListening={isListening} 
        />

        {/* Speech Bubble Stream */}
        <View className="flex-1 pt-3">
          <View className="px-5 mb-2">
            <Text className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Luồng phiên âm thời gian thực ({utterances.length})
            </Text>
          </View>

          <FlatList
            data={utterances}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SpeechBubbleItem utterance={item} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Bottom Visualizer & Controls */}
        <SafeAreaView edges={['bottom']} className="bg-slate-900">
          <LiveVisualizerBar 
            isListening={isListening} 
            onToggleListening={toggleListening} 
          />
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
