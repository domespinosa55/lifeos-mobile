// Chat Store - Zustand state management
import { create } from 'zustand';
import type { Message } from '../types';
import { gateway } from '../api/gateway';

interface ChatState {
  messages: Message[];
  userId: string;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  initSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

// Generate stable user ID for session continuity
const generateUserId = () => {
  const stored = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('lifeos_user_id') 
    : null;
  if (stored) return stored;
  
  const newId = `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lifeos_user_id', newId);
  }
  return newId;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  userId: generateUserId(),
  isLoading: false,
  isConnected: false,
  error: null,

  initSession: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Test connection with a ping
      const connected = await gateway.ping();
      
      if (connected) {
        set({ isConnected: true, isLoading: false });
      } else {
        set({
          error: 'Could not connect to gateway',
          isLoading: false,
          isConnected: false,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to connect',
        isLoading: false,
        isConnected: false,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { userId, messages } = get();

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    set({ messages: [...messages, userMessage], isLoading: true, error: null });

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
        content,
        userId,
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
          set({ isLoading: false, isConnected: true });
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
