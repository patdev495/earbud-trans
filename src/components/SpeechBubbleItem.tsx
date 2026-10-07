import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Copy, Check, Zap, Clock } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Utterance } from '../types';
import { colors } from '../theme/colors';

interface SpeechBubbleItemProps {
  utterance: Utterance;
}

export const SpeechBubbleItem: React.FC<SpeechBubbleItemProps> = ({ utterance }) => {
  const [copied, setCopied] = useState(false);
  const isChinese = utterance.language === 'zh' || !!utterance.pinyin || /[\u4e00-\u9fa5]/.test(utterance.text);
  const meta = isChinese ? colors.lang.zh : (colors.lang[utterance.language] || colors.lang.vi);
  const timeFormatted = new Date(utterance.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleCopy = async () => {
    const copyContent = utterance.pinyin
      ? `${utterance.text}\n(${utterance.pinyin})`
      : utterance.text;
    await Clipboard.setStringAsync(copyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.card}>
      {/* Top Meta Bar */}
      <View style={styles.metaRow}>
        <View style={styles.badgeRow}>
          {/* Language Pill */}
          <View
            style={[
              styles.langBadge,
              { backgroundColor: meta.bg, borderColor: meta.border },
            ]}
          >
            <Text style={[styles.langBadgeText, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
          <Text style={styles.langName}>{meta.name}</Text>

          {/* Latency Tag */}
          {utterance.latencyMs !== undefined && (
            <View style={styles.statTag}>
              <Zap size={10} color={colors.primary} />
              <Text style={styles.statText}>{utterance.latencyMs}ms</Text>
            </View>
          )}

          {/* Audio Duration Tag */}
          {utterance.durationSec !== undefined && (
            <View style={styles.statTag}>
              <Clock size={10} color={colors.textMuted} />
              <Text style={styles.statText}>{utterance.durationSec}s</Text>
            </View>
          )}
        </View>

        {/* Copy Button & Timestamp */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handleCopy}
            style={[styles.copyButton, copied && styles.copyButtonActive]}
            activeOpacity={0.7}
          >
            {copied ? (
              <Check size={12} color={colors.success} />
            ) : (
              <Copy size={12} color={colors.textSecondary} />
            )}
            <Text
              style={[
                styles.copyButtonText,
                copied && { color: colors.success },
              ]}
            >
              {copied ? 'Đã chép' : 'Sao chép'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{timeFormatted}</Text>
        </View>
      </View>

      {/* Transcription Text Content */}
      <Text style={styles.transcriptionText}>{utterance.text}</Text>

      {/* Chinese Pinyin Pronunciation */}
      {utterance.pinyin ? (
        <View style={styles.pinyinContainer}>
          <Text style={styles.pinyinLabel}>PINYIN</Text>
          <Text style={styles.pinyinText}>{utterance.pinyin}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  langBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  langName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  copyButtonActive: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  transcriptionText: {
    color: colors.textPrimary,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
  },
  pinyinContainer: {
    marginTop: 8,
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinyinLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.warning,
  },
  pinyinText: {
    fontSize: 13,
    color: '#FDE68A',
    fontWeight: '500',
    fontStyle: 'italic',
    flex: 1,
  },
});
