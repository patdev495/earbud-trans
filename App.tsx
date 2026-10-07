import "./global.css";
import React, { useState, useRef } from 'react';
import { View, FlatList, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { SpeechBubbleItem } from './src/components/SpeechBubbleItem';
import { LiveVisualizerBar } from './src/components/LiveVisualizerBar';
import { useAudioRecorder } from './src/hooks/useAudioRecorder';
import { Utterance } from './src/types';

let utteranceCounter = 1;

export default function App() {
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const flatListRef = useRef<FlatList<Utterance>>(null);
  const [isBluetoothConnected] = useState<boolean>(false);

  const { recordingState, errorMessage, startRecording, stopAndTranscribe } = useAudioRecorder();

  const isListening = recordingState === 'recording';

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async () => {
    const result = await stopAndTranscribe();
    if (result && result.text.trim()) {
      const newUtterance: Utterance = {
        id: String(utteranceCounter++),
        text: result.text.trim(),
        language: result.language,
        timestamp: Date.now(),
      };
      setUtterances(prev => [...prev, newUtterance]);

      // Auto-scroll to newest bubble
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
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
          {utterances.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Text className="text-slate-600 text-base text-center font-medium leading-7">
                Bấm nút bên dưới để bắt đầu thu âm.{'\n'}
                Nói tiếng Anh, Việt hoặc Trung —{'\n'}AI sẽ tự nhận diện và hiển thị text.
              </Text>
            </View>
          ) : (
            <>
              <View className="px-5 mb-2">
                <Text className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Luồng phiên âm ({utterances.length})
                </Text>
              </View>
              <FlatList
                ref={flatListRef}
                data={utterances}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SpeechBubbleItem utterance={item} />}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>

        {/* Bottom Visualizer & Controls */}
        <SafeAreaView edges={['bottom']} className="bg-slate-900">
          <LiveVisualizerBar
            recordingState={recordingState}
            errorMessage={errorMessage}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
