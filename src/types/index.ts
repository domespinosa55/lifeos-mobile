// LifeOS Mobile Types

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  label?: string;
  agentId?: string;
  model?: string;
  createdAt: Date;
  lastActivity?: Date;
}

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  description?: string;
  lastMessage?: string;
}

export interface Recording {
  id: string;
  uri: string;
  duration: number;
  createdAt: Date;
  transcription?: string;
}

export interface GatewayEvent {
  type: 'chunk' | 'done' | 'error';
  sessionId: string;
  data?: string;
  error?: string;
}
