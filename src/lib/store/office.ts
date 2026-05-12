import { create } from 'zustand';
import { Agent, AgentState, AGENTS } from '@/lib/agents/config';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentConversation {
  messages: Message[];
  state: AgentState;
}

interface OfficeStore {
  activeAgentId: string | null;
  conversations: Record<string, AgentConversation>;
  setActiveAgent: (id: string | null) => void;
  addMessage: (agentId: string, message: Message) => void;
  updateLastMessage: (agentId: string, content: string) => void;
  setAgentState: (agentId: string, state: AgentState) => void;
  getConversation: (agentId: string) => AgentConversation;
  clearConversation: (agentId: string) => void;
}

const defaultConversation = (): AgentConversation => ({
  messages: [],
  state: 'idle',
});

export const useOfficeStore = create<OfficeStore>((set, get) => ({
  activeAgentId: null,
  conversations: Object.fromEntries(
    AGENTS.map((a) => [a.id, defaultConversation()])
  ),

  setActiveAgent: (id) => set({ activeAgentId: id }),

  addMessage: (agentId, message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [agentId]: {
          ...state.conversations[agentId],
          messages: [...(state.conversations[agentId]?.messages ?? []), message],
        },
      },
    })),

  updateLastMessage: (agentId, content) =>
    set((state) => {
      const conv = state.conversations[agentId];
      if (!conv) return state;
      const messages = [...conv.messages];
      if (messages.length === 0) return state;
      messages[messages.length - 1] = { ...messages[messages.length - 1], content };
      return {
        conversations: {
          ...state.conversations,
          [agentId]: { ...conv, messages },
        },
      };
    }),

  setAgentState: (agentId, agentState) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [agentId]: {
          ...state.conversations[agentId],
          state: agentState,
        },
      },
    })),

  getConversation: (agentId) =>
    get().conversations[agentId] ?? defaultConversation(),

  clearConversation: (agentId) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [agentId]: defaultConversation(),
      },
    })),
}));
