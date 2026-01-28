// Chat Store - Main chat (synced with Main Agent)
import { create } from 'zustand';
import type { Message } from '../types';
import { gateway } from '../api/gateway';
import { useConversationStore } from './conversationStore';

const MAIN_AGENT_ID = 'main';

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
  loadFromConversationStore: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  userId: 'dom',
  isLoading: false,
  isConnected: false,
  error: null,

  initSession: async () => {
    // Load existing messages from conversation store
    get().loadFromConversationStore();
    set({ isConnected: true, isLoading: false, error: null });
  },

  loadFromConversationStore: () => {
    const storedMessages = useConversationStore.getState().getMessages(MAIN_AGENT_ID);
    set({ messages: storedMessages });
  },

  sendMessage: async (content: string) => {
    const { userId, messages } = get();
    const conversationStore = useConversationStore.getState();

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    // Update local state and persist
    set({ messages: [...messages, userMessage], isLoading: true, error: null });
    conversationStore.addMessage(MAIN_AGENT_ID, userMessage);

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
      // Use non-streaming for React Native compatibility
      const response = await gateway.send(content, userId);
      
      // Update with response
      const finalAssistantMessage: Message = {
        ...assistantMessage,
        content: response,
      };

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantId ? finalAssistantMessage : m
        ),
        isLoading: false,
        isConnected: true,
      }));

      // Persist assistant message
      conversationStore.addMessage(MAIN_AGENT_ID, finalAssistantMessage);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to send message',
        isLoading: false,
      });
      
      // Remove empty assistant message on error
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== assistantId),
      }));
    }
  },

  clearMessages: () => {
    useConversationStore.getState().clearConversation(MAIN_AGENT_ID);
    set({ messages: [], error: null });
  },
}));
