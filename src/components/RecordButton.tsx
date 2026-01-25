// Record Button Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../constants/config';

interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function RecordButton({
  isRecording,
  isPaused,
  duration,
  onPress,
  onLongPress,
}: RecordButtonProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {isRecording && (
        <View style={styles.durationContainer}>
          <View style={[styles.recordingDot, isPaused && styles.pausedDot]} />
          <Text style={styles.duration}>{formatDuration(duration)}</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          isRecording && styles.buttonRecording,
          isPaused && styles.buttonPaused,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isRecording ? (isPaused ? 'play' : 'stop') : 'mic'}
          size={32}
          color={COLORS.text}
        />
      </TouchableOpacity>
      
      <Text style={styles.label}>
        {isRecording
          ? isPaused
            ? 'Tap to resume'
            : 'Tap to stop'
          : 'Tap to record'}
      </Text>
    </View>
  );
}

const { COLORS } = CONFIG;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    marginRight: 8,
  },
  pausedDot: {
    backgroundColor: COLORS.warning,
  },
  duration: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonRecording: {
    backgroundColor: COLORS.error,
  },
  buttonPaused: {
    backgroundColor: COLORS.warning,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
