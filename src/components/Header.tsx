import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Headphones, Radio, Sparkles, Cpu } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface HeaderProps {
  isBluetoothConnected: boolean;
  isListening: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isBluetoothConnected, isListening }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {/* Branding */}
        <View style={styles.brandingRow}>
          <View style={styles.iconBox}>
            <Sparkles size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Earbuds Live</Text>
            <View style={styles.aiTagRow}>
              <Cpu size={10} color={colors.success} />
              <Text style={styles.subtitle}>Groq Whisper v3</Text>
            </View>
          </View>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusRow}>
          {/* Audio Input Device Badge */}
          <View style={styles.pillBadge}>
            <Headphones
              size={13}
              color={isBluetoothConnected ? colors.primary : colors.textSecondary}
            />
            <Text style={styles.pillText}>
              {isBluetoothConnected ? 'Earbuds' : 'Mic máy'}
            </Text>
          </View>

          {/* Live Status Pill */}
          <View
            style={[
              styles.pillBadge,
              isListening && styles.pillActiveListening,
            ]}
          >
            <Radio
              size={13}
              color={isListening ? colors.success : colors.textMuted}
            />
            <Text
              style={[
                styles.pillText,
                isListening && styles.pillActiveText,
              ]}
            >
              {isListening ? 'LIVE' : 'SẴN SÀNG'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.bg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  aiTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  subtitle: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillActiveListening: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillActiveText: {
    color: colors.success,
  },
});
