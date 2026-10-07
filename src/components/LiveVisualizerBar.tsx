import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Mic, MicOff, Radio, Sparkles, ShieldAlert, ShieldCheck, Shield } from 'lucide-react-native';
import { Mode, Sensitivity, RecordingStatusState } from '../hooks/useHandsfreeTranslator';
import { colors } from '../theme/colors';

interface LiveVisualizerBarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  sensitivity: Sensitivity;
  setSensitivity: (sens: Sensitivity) => void;
  status: RecordingStatusState;
  errorMessage: string | null;
  audioLevel: number;
  isHandsfreeActive: boolean;
  pendingTasksCount: number;
  onStartManual: () => void;
  onStopManual: () => void;
  onToggleHandsfree: () => void;
}

const STATUS_DETAILS: Record<
  RecordingStatusState,
  { title: string; subtitle: string; dotColor: string; textColor: string }
> = {
  idle: {
    title: 'Đang tạm dừng',
    subtitle: 'Bật chế độ rảnh tay hoặc bấm nút để thu âm',
    dotColor: colors.textMuted,
    textColor: colors.textSecondary,
  },
  listening: {
    title: 'Đang lắng nghe rảnh tay...',
    subtitle: 'Nói bất kỳ lúc nào — AI sẽ tự ngắt & dịch',
    dotColor: colors.success,
    textColor: colors.success,
  },
  speaking: {
    title: 'Phát hiện giọng nói...',
    subtitle: 'Đang thu nhận âm thanh từ micro',
    dotColor: colors.primary,
    textColor: colors.primary,
  },
  processing: {
    title: 'Đang gửi AI phiên âm...',
    subtitle: 'Groq Whisper Large-v3 đang xử lý',
    dotColor: colors.warning,
    textColor: colors.warning,
  },
  error: {
    title: 'Có lỗi xảy ra',
    subtitle: 'Kiểm tra quyền micro hoặc API key',
    dotColor: colors.danger,
    textColor: colors.danger,
  },
};

const SENSITIVITY_CONFIG: Record<
  Sensitivity,
  { label: string; sub: string; icon: typeof Shield }
> = {
  low: {
    label: 'Chống ồn cao',
    sub: 'Quán cafe / Đường phố',
    icon: ShieldCheck,
  },
  medium: {
    label: 'Tiêu chuẩn',
    sub: 'Văn phòng / Bình thường',
    icon: Shield,
  },
  high: {
    label: 'Độ nhạy cao',
    sub: 'Phòng kín / Thì thầm',
    icon: ShieldAlert,
  },
};

export const LiveVisualizerBar: React.FC<LiveVisualizerBarProps> = ({
  mode,
  setMode,
  sensitivity,
  setSensitivity,
  status,
  errorMessage,
  audioLevel,
  isHandsfreeActive,
  pendingTasksCount,
  onStartManual,
  onStopManual,
  onToggleHandsfree,
}) => {
  const currentDetail = STATUS_DETAILS[status] || STATUS_DETAILS.idle;
  const isManualRecording = mode === 'manual' && status === 'speaking';
  const isBusy = status === 'processing';

  // 9 Visualizer bars generated dynamically from audioLevel
  const barHeights = [
    Math.max(4, audioLevel * 28 * 0.4),
    Math.max(4, audioLevel * 32 * 0.7),
    Math.max(4, audioLevel * 36 * 1.0),
    Math.max(4, audioLevel * 30 * 0.85),
    Math.max(4, audioLevel * 40 * 1.2),
    Math.max(4, audioLevel * 34 * 0.9),
    Math.max(4, audioLevel * 36 * 1.0),
    Math.max(4, audioLevel * 30 * 0.6),
    Math.max(4, audioLevel * 24 * 0.35),
  ];

  return (
    <View style={styles.container}>
      {/* Error Banner */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Mode Selector Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isHandsfreeActive) onToggleHandsfree();
            setMode('handsfree');
          }}
          style={[styles.tabButton, mode === 'handsfree' && styles.tabButtonActive]}
          activeOpacity={0.7}
        >
          <Sparkles
            size={14}
            color={mode === 'handsfree' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              mode === 'handsfree' && styles.tabButtonTextActive,
            ]}
          >
            Rảnh Tay (Auto VAD)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (isHandsfreeActive) onToggleHandsfree();
            setMode('manual');
          }}
          style={[styles.tabButton, mode === 'manual' && styles.tabButtonActive]}
          activeOpacity={0.7}
        >
          <Mic
            size={14}
            color={mode === 'manual' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              mode === 'manual' && styles.tabButtonTextActive,
            ]}
          >
            Bấm Thủ Công
          </Text>
        </TouchableOpacity>
      </View>

      {/* Noise Gate / Sensitivity Selector (Hands-Free Only) */}
      {mode === 'handsfree' && (
        <View style={styles.sensitivityContainer}>
          {(['low', 'medium', 'high'] as Sensitivity[]).map((sensKey) => {
            const isSelected = sensitivity === sensKey;
            const cfg = SENSITIVITY_CONFIG[sensKey];
            return (
              <TouchableOpacity
                key={sensKey}
                onPress={() => setSensitivity(sensKey)}
                style={[
                  styles.sensTab,
                  isSelected && styles.sensTabActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sensTabText,
                    isSelected && styles.sensTabTextActive,
                  ]}
                >
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Status & Live Waveform Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <View style={styles.statusTitleRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: currentDetail.dotColor },
                ]}
              />
              <Text style={[styles.statusTitle, { color: currentDetail.textColor }]}>
                {currentDetail.title}
              </Text>
            </View>
            <Text style={styles.statusSubtitle}>{currentDetail.subtitle}</Text>
          </View>

          {/* Realtime Waveform Display */}
          <View style={styles.waveformContainer}>
            {barHeights.map((h, index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  { height: h },
                  status === 'speaking'
                    ? styles.waveBarActive
                    : isHandsfreeActive
                    ? styles.waveBarListening
                    : styles.waveBarIdle,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Async background pending tasks badge */}
        {pendingTasksCount > 0 && (
          <View style={styles.pendingRow}>
            <Text style={styles.pendingLabel}>Đang phiên âm nền:</Text>
            <View style={styles.pendingBadge}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.pendingText}>{pendingTasksCount} đoạn</Text>
            </View>
          </View>
        )}
      </View>

      {/* Main Action Button */}
      {mode === 'handsfree' ? (
        <TouchableOpacity
          onPress={onToggleHandsfree}
          activeOpacity={0.8}
          style={[
            styles.actionButton,
            isHandsfreeActive
              ? styles.actionButtonActive
              : styles.actionButtonPrimary,
          ]}
        >
          {isHandsfreeActive ? (
            <>
              <Radio size={20} color={colors.danger} />
              <Text style={styles.actionButtonActiveText}>
                Dừng Lắng Nghe Rảnh Tay
              </Text>
            </>
          ) : (
            <>
              <Radio size={20} color={colors.bg} />
              <Text style={styles.actionButtonPrimaryText}>
                Bắt Đầu Lắng Nghe Rảnh Tay
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={isManualRecording ? onStopManual : onStartManual}
          activeOpacity={0.8}
          disabled={isBusy}
          style={[
            styles.actionButton,
            isBusy
              ? styles.actionButtonDisabled
              : isManualRecording
              ? styles.actionButtonActive
              : styles.actionButtonPrimary,
          ]}
        >
          {isBusy ? (
            <>
              <ActivityIndicator size="small" color={colors.textSecondary} />
              <Text style={styles.actionButtonDisabledText}>Đang xử lý...</Text>
            </>
          ) : isManualRecording ? (
            <>
              <MicOff size={20} color={colors.danger} />
              <Text style={styles.actionButtonActiveText}>Dừng & Phiên Âm</Text>
            </>
          ) : (
            <>
              <Mic size={20} color={colors.bg} />
              <Text style={styles.actionButtonPrimaryText}>Bấm Để Thu Âm</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  errorBox: {
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.primary,
  },
  sensitivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
    gap: 4,
  },
  sensTab: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensTabActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  sensTabText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  sensTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  statusCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
    paddingRight: 10,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 40,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  waveBar: {
    width: 4,
    borderRadius: 4,
  },
  waveBarActive: {
    backgroundColor: colors.primary,
  },
  waveBarListening: {
    backgroundColor: 'rgba(16, 185, 129, 0.6)',
  },
  waveBarIdle: {
    backgroundColor: colors.textMuted,
  },
  pendingRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  actionButton: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  actionButtonPrimaryText: {
    color: colors.bg,
    fontWeight: '800',
    fontSize: 15,
  },
  actionButtonActive: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  actionButtonActiveText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 15,
  },
  actionButtonDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    opacity: 0.6,
  },
  actionButtonDisabledText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
});
