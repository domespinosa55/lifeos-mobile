// Chat Store - Zustand state management
import { create } from 'zustand';
import type { Message } from '../types';
import { gateway } from '../api/gateway';

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  initSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  isConnected: false,
  error: null,

  initSession: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Spawn a new session for mobile
      const { sessionId } = await gateway.spawn({
        label: 'mobile-chat',
        channel: 'mobile',
      });
      
      set({ sessionId, isConnected: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to connect',
        isLoading: false,
        isConnected: false,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { sessionId, messages } = get();
    
    if (!sessionId) {
      set({ error: 'No active session' });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    set({ messages: [...messages, userMessage], isLoading: true });

    // Create placeholder for assistant response
    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, assistantMessage],
    }));

    try {
      await gateway.sendAndStream(
        sessionId,
        content,
        // On chunk
        (text) => {
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + text }
                : m
            ),
          }));
        },
        // On done
        () => {
          set({ isLoading: false });
        },
        // On error
        (error) => {
          set({ error, isLoading: false });
        }
      );
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to send message',
        isLoading: false,
      });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },
}));
