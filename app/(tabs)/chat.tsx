// Chat Screen - Main interaction with Clawdbot
import React, { useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';
import { ChatBubble } from '../../src/components/ChatBubble';
import { ChatInput } from '../../src/components/ChatInput';
import { useChatStore } from '../../src/stores/chatStore';
import { useAudioStore } from '../../src/stores/audioStore';
import type { Message } from '../../src/types';

const { COLORS } = CONFIG;

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    sessionId,
    isLoading,
    isConnected,
    error,
    initSession,
    sendMessage,
    clearMessages,
  } = useChatStore();

  const { isRecording, startRecording, stopRecording, requestPermission } = useAudioStore();

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  const handleMicPress = async () => {
    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        // TODO: Transcribe and send
        console.log('Recording stopped:', recording.uri);
      }
    } else {
      await requestPermission();
      await startRecording();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubble-ellipses-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Start a conversation</Text>
      <Text style={styles.emptySubtitle}>
        Type a message or tap the mic to talk to LifeOS
      </Text>
    </View>
  );

  const renderConnectionStatus = () => {
    if (error) {
      return (
        <TouchableOpacity style={styles.errorBanner} onPress={initSession}>
          <Ionicons name="warning" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      );
    }

    if (!isConnected) {
      return (
        <View style={styles.connectingBanner}>
          <ActivityIndicator size="small" color={COLORS.accent} />
          <Text style={styles.connectingText}>Connecting to LifeOS...</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {renderConnectionStatus()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messageList,
          messages.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      
      {isLoading && messages.length > 0 && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.accent} />
          <Text style={styles.typingText}>LifeOS is thinking...</Text>
        </View>
      )}
      
      <ChatInput
        onSend={handleSend}
        onMicPress={handleMicPress}
        disabled={!isConnected || isLoading}
        isRecording={isRecording}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messageList: {
    paddingVertical: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}20`,
    padding: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 14,
  },
  retryText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  connectingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    gap: 8,
  },
  connectingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  typingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
