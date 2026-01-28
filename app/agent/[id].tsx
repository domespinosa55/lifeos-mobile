// Agent Chat Screen - Chat with a specific agent (with persistence)
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';
import { ChatBubble } from '../../src/components/ChatBubble';
import { ChatInput } from '../../src/components/ChatInput';
import { agentsAPI, AGENT_CONFIGS } from '../../src/api/agents';
import { useConversationStore } from '../../src/stores/conversationStore';
import type { Message } from '../../src/types';

const { COLORS } = CONFIG;

export default function AgentChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  // Get persisted messages from conversation store
  const { addMessage, getMessages } = useConversationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get agent config
  const agent = AGENT_CONFIGS.find(a => a.id === id);

  // Load persisted messages on mount
  useEffect(() => {
    if (id) {
      const storedMessages = getMessages(id);
      setMessages(storedMessages);
    }
  }, [id]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!id) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    addMessage(id, userMessage); // Persist
    setIsLoading(true);
    setError(null);

    // Add placeholder for assistant
    const assistantId = `assistant-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantPlaceholder]);

    try {
      const response = await agentsAPI.chat(id, content);
      
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => prev.map(m => 
        m.id === assistantId ? assistantMessage : m
      ));
      
      addMessage(id, assistantMessage); // Persist
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.agentEmoji}>{agent?.emoji || '🤖'}</Text>
      <Text style={styles.emptyTitle}>Chat with {agent?.name}</Text>
      <Text style={styles.emptySubtitle}>
        {agent?.description}
      </Text>
      <Text style={styles.persistenceNote}>
        Conversations are saved and summarized daily
      </Text>
    </View>
  );

  if (!agent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Agent not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: agent.name,
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={16} color={COLORS.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {messages.length > 0 && (
          <View style={styles.conversationInfo}>
            <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
            <Text style={styles.conversationInfoText}>
              {messages.length} messages today
            </Text>
          </View>
        )}
        
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
            <Text style={styles.typingText}>{agent.name} is thinking...</Text>
          </View>
        )}
        
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginLeft: 8,
  },
  infoButton: {
    marginRight: 8,
  },
  conversationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  conversationInfoText: {
    fontSize: 12,
    color: COLORS.textTertiary,
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
  agentEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  persistenceNote: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 16,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
  },
  backLink: {
    color: COLORS.accent,
    marginTop: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}20`,
    padding: 12,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.error,
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
