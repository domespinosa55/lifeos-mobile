// Chat Input Component - Simplified
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  onMicPress?: () => void;
  disabled?: boolean;
  isRecording?: boolean;
}

export function ChatInput({ onSend, onMicPress, disabled, isRecording }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={onMicPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRecording ? 'mic' : 'mic-outline'}
            size={22}
            color={isRecording ? '#ef4444' : '#a1a1aa'}
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message LifeOS..."
          placeholderTextColor="#71717a"
          multiline={false}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, text.trim() ? styles.sendButtonActive : null]}
          onPress={handleSend}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={text.trim() ? '#ffffff' : '#71717a'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181b',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#09090b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fafafa',
    borderWidth: 1,
    borderColor: '#3f3f46',
    minHeight: 44,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
});
