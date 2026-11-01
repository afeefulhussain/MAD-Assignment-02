import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

export default function ActionButtons({
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  canUndo,
}) {
  return (
    <View style={styles.container}>
      {/* ABSENT (RED CROSS) */}
      <TouchableOpacity
        style={[styles.button, styles.absentBtn, SHADOWS.btn]}
        onPress={onSwipeLeft}
        activeOpacity={0.75}
      >
        <Ionicons name="close" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* UNDO / REWIND */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.undoBtn,
          SHADOWS.btn,
          !canUndo && styles.disabledBtn,
        ]}
        onPress={onUndo}
        disabled={!canUndo}
        activeOpacity={0.75}
      >
        <Ionicons
          name="arrow-undo"
          size={20}
          color={canUndo ? COLORS.warning : COLORS.textMuted}
        />
      </TouchableOpacity>

      {/* PRESENT (GREEN CHECK) */}
      <TouchableOpacity
        style={[styles.button, styles.presentBtn, SHADOWS.btn]}
        onPress={onSwipeRight}
        activeOpacity={0.75}
      >
        <Ionicons name="checkmark" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    marginVertical: 14,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  absentBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.absent,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  presentBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.present,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  undoBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgCardHover,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  disabledBtn: {
    opacity: 0.35,
  },
});
