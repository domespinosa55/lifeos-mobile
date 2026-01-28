// Conversation Store - Persists agent conversations
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Message } from '../types';

interface Conversation {
  agentId: string;
  messages: Message[];
  startedAt: string;
  updatedAt: string;
}

interface ConversationState {
  conversations: Record<string, Conversation>;
  
  // Actions
  addMessage: (agentId: string, message: Message) => void;
  getMessages: (agentId: string) => Message[];
  clearConversation: (agentId: string) => void;
  clearAllConversations: () => void;
  getConversationSummary: (agentId: string) => string;
  getAllConversationsForDay: () => Conversation[];
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: {},

      addMessage: (agentId: string, message: Message) => {
        const now = new Date().toISOString();
        
        set((state) => {
          const existing = state.conversations[agentId];
          
          return {
            conversations: {
              ...state.conversations,
              [agentId]: {
                agentId,
                messages: [...(existing?.messages || []), message],
                startedAt: existing?.startedAt || now,
                updatedAt: now,
              },
            },
          };
        });
      },

      getMessages: (agentId: string) => {
        return get().conversations[agentId]?.messages || [];
      },

      clearConversation: (agentId: string) => {
        set((state) => {
          const { [agentId]: _, ...rest } = state.conversations;
          return { conversations: rest };
        });
      },

      clearAllConversations: () => {
        set({ conversations: {} });
      },

      getConversationSummary: (agentId: string) => {
        const convo = get().conversations[agentId];
        if (!convo) return '';
        
        const messageCount = convo.messages.length;
        const userMessages = convo.messages.filter(m => m.role === 'user').length;
        
        return `${messageCount} messages (${userMessages} from user)`;
      },

      getAllConversationsForDay: () => {
        const today = getToday();
        const convos = get().conversations;
        
        return Object.values(convos).filter(c => 
          c.startedAt.startsWith(today) || c.updatedAt.startsWith(today)
        );
      },
    }),
    {
      name: 'lifeos-conversations',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
