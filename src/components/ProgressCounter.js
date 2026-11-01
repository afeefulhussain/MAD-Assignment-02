import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function ProgressCounter({
  currentIndex,
  total,
  presentCount,
  absentCount,
}) {
  const percentage = total > 0 ? Math.min(100, Math.round(((currentIndex) / total) * 100)) : 0;
  const displayNumber = Math.min(currentIndex + 1, total);

  return (
    <View style={styles.container}>
      {/* Top row: Counter & Live Stat chips */}
      <View style={styles.counterRow}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            Student <Text style={styles.counterHighlight}>{total > 0 ? displayNumber : 0}</Text>
            <Text style={styles.counterTotal}> / {total}</Text>
          </Text>
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.miniChip, { backgroundColor: COLORS.presentGlow }]}>
            <View style={[styles.dot, { backgroundColor: COLORS.present }]} />
            <Text style={[styles.chipText, { color: COLORS.presentText }]}>
              {presentCount} P
            </Text>
          </View>

          <View style={[styles.miniChip, { backgroundColor: COLORS.absentGlow }]}>
            <View style={[styles.dot, { backgroundColor: COLORS.absent }]} />
            <Text style={[styles.chipText, { color: COLORS.absentText }]}>
              {absentCount} A
            </Text>
          </View>

          <View style={[styles.pctChip]}>
            <Text style={styles.pctText}>{percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  counterHighlight: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  counterTotal: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pctChip: {
    backgroundColor: COLORS.bgCardHover,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryLight,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.bgCardHover,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
  },
});
