// Record Button Component - 2026 Design System
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    if (isRecording && !isPaused) {
      // Pulsing animation while recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0.3);
    }
  }, [isRecording, isPaused]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonColor = () => {
    if (isRecording) {
      return isPaused ? COLORS.warning : COLORS.error;
    }
    return COLORS.accent;
  };

  return (
    <View style={styles.container}>
      {isRecording && (
        <View style={styles.durationContainer}>
          <Animated.View 
            style={[
              styles.recordingDot, 
              isPaused && styles.pausedDot,
              { opacity: isPaused ? 1 : glowAnim }
            ]} 
          />
          <Text style={styles.duration}>{formatDuration(duration)}</Text>
        </View>
      )}
      
      {/* Outer glow ring */}
      {isRecording && !isPaused && (
        <Animated.View 
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: glowAnim,
            }
          ]} 
        />
      )}
      
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getButtonColor() },
            isRecording && styles.buttonRecording,
          ]}
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isRecording ? (isPaused ? 'play' : 'stop') : 'mic'}
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>
      </Animated.View>
      
      <Text style={styles.label}>
        {isRecording
          ? isPaused
            ? 'Tap to resume'
            : 'Tap to stop'
          : 'Tap to record'}
      </Text>
      
      {!isRecording && (
        <Text style={styles.hint}>Hold for quick voice note</Text>
      )}
    </View>
  );
}

const { COLORS, SPACING, RADIUS, FONT_SIZE } = CONFIG;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    marginRight: SPACING.sm,
    // Glow effect
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  pausedDot: {
    backgroundColor: COLORS.warning,
    shadowColor: COLORS.warning,
  },
  duration: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  glowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.error,
    top: '50%',
    marginTop: -10,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow/glow
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonRecording: {
    shadowColor: COLORS.error,
    shadowOpacity: 0.5,
  },
  label: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  hint: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});
