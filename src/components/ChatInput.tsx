// Chat Input Component - 2026 Design System
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../constants/config';

interface ChatInputProps {
  onSend: (message: string) => void;
  onMicPress?: () => void;
  disabled?: boolean;
  isRecording?: boolean;
}

export function ChatInput({ onSend, onMicPress, disabled, isRecording }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Glass background effect */}
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[
            styles.micButton, 
            isRecording && styles.micButtonActive
          ]}
          onPress={onMicPress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRecording ? 'mic' : 'mic-outline'}
            size={22}
            color={isRecording ? '#ffffff' : COLORS.textSecondary}
          />
        </TouchableOpacity>
        
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message LifeOS..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            maxLength={2000}
            editable={!disabled}
            onSubmitEditing={handleSend}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            blurOnSubmit={false}
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.sendButton, 
            text.trim() && !disabled ? styles.sendButtonActive : styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={text.trim() && !disabled ? '#ffffff' : COLORS.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { COLORS, SPACING, RADIUS } = CONFIG;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING['2xl'],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  micButtonActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
    // Glow effect
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputContainerFocused: {
    borderColor: COLORS.accent,
    // Subtle glow when focused
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 120,
    minHeight: 42,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.accent,
    // Glow effect
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
