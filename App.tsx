import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, MessageSquareText } from 'lucide-react-native';
import { Header } from './src/components/Header';
import { SpeechBubbleItem } from './src/components/SpeechBubbleItem';
import { LiveVisualizerBar } from './src/components/LiveVisualizerBar';
import { useHandsfreeTranslator } from './src/hooks/useHandsfreeTranslator';
import { STTResult } from './src/services/groqSTT';
import { Utterance } from './src/types';
import { colors } from './src/theme/colors';
import { pinyin } from 'pinyin-pro';

let utteranceCounter = 1;

export default function App() {
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const flatListRef = useRef<FlatList<Utterance>>(null);
  const [isBluetoothConnected] = useState<boolean>(false);

  const handleNewUtterance = useCallback((result: STTResult) => {
    const text = result.text.trim();
    if (!text) return;

    let pinyinText: string | undefined = undefined;
    if (result.language === 'zh' || /[\u4e00-\u9fa5]/.test(text)) {
      try {
        pinyinText = pinyin(text);
      } catch (_) {}
    }

    const newUtterance: Utterance = {
      id: String(utteranceCounter++),
      text,
      language: result.language,
      timestamp: Date.now(),
      latencyMs: result.latencyMs,
      durationSec: result.durationSec,
      pinyin: pinyinText,
    };

    setUtterances(prev => [...prev, newUtterance]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, []);

  const {
    mode,
    setMode,
    sensitivity,
    setSensitivity,
    status,
    errorMessage,
    audioLevel,
    noiseFloorDb,
    isHandsfreeActive,
    pendingTasksCount,
    startManualRecording,
    stopManualRecording,
    toggleHandsfree,
  } = useHandsfreeTranslator({
    onNewUtterance: handleNewUtterance,
  });

  const isListening = isHandsfreeActive || status === 'speaking' || status === 'listening';

  const clearHistory = () => {
    setUtterances([]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />

        {/* Top Header */}
        <Header
          isBluetoothConnected={isBluetoothConnected}
          isListening={isListening}
        />

        {/* Speech Bubble Stream */}
        <View style={styles.streamContainer}>
          {utterances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <MessageSquareText size={32} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Sẵn Sàng Phiên Âm</Text>
              <Text style={styles.emptySubtitle}>
                Bật chế độ{' '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  Rảnh Tay (Auto VAD)
                </Text>{' '}
                và bắt đầu nói.{'\n'}
                AI sẽ tự động nhận diện{' '}
                <Text style={{ color: colors.success, fontWeight: '600' }}>
                  Tiếng Việt
                </Text>
                ,{' '}
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  English
                </Text>{' '}
                hoặc{' '}
                <Text style={{ color: colors.warning, fontWeight: '600' }}>
                  中文
                </Text>
                .
              </Text>
            </View>
          ) : (
            <>
              {/* Stream Subheader */}
              <View style={styles.subHeader}>
                <Text style={styles.subHeaderTitle}>
                  Hội thoại ({utterances.length})
                </Text>
                <TouchableOpacity
                  onPress={clearHistory}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <Trash2 size={12} color={colors.textSecondary} />
                  <Text style={styles.clearButtonText}>Xóa lịch sử</Text>
                </TouchableOpacity>
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

        {/* Bottom Audio Visualizer & Control Dock */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.surface }}>
          <LiveVisualizerBar
            mode={mode}
            setMode={setMode}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
            status={status}
            errorMessage={errorMessage}
            audioLevel={audioLevel}
            noiseFloorDb={noiseFloorDb}
            isHandsfreeActive={isHandsfreeActive}
            pendingTasksCount={pendingTasksCount}
            onStartManual={startManualRecording}
            onStopManual={stopManualRecording}
            onToggleHandsfree={toggleHandsfree}
          />
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  streamContainer: {
    flex: 1,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  clearButtonText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
