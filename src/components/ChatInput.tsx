// Chat Input Component
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, isRecording && styles.micButtonActive]}
        onPress={onMicPress}
        disabled={disabled}
      >
        <Ionicons
          name={isRecording ? 'mic' : 'mic-outline'}
          size={24}
          color={isRecording ? COLORS.accent : COLORS.text}
        />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Message LifeOS..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
        maxLength={2000}
        editable={!disabled}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      
      <TouchableOpacity
        style={[styles.sendButton, (!text.trim() || disabled) && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Ionicons
          name="send"
          size={20}
          color={text.trim() && !disabled ? COLORS.text : COLORS.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const { COLORS } = CONFIG;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingBottom: 24,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  micButtonActive: {
    backgroundColor: COLORS.accent,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.primary,
  },
});
