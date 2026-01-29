// Agents API - Fetch and manage agents from gateway
import { CONFIG } from '../constants/config';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  systemPrompt?: string;
}

export interface LiveAgent {
  sessionKey: string;
  agentId: string;
  label?: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// Predefined agent configs (these are your "GPTs")
export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'main',
    name: 'Main Agent',
    emoji: '🧠',
    description: 'Your primary AI orchestrator. Knows everything, can spawn sub-agents.',
  },
  {
    id: 'product',
    name: 'Head of Product',
    emoji: '📱',
    description: 'Product development, UI/UX, feature planning.',
    systemPrompt: 'You are a Head of Product. Focus on user experience, product strategy, and feature prioritization.',
  },
  {
    id: 'analyst',
    name: 'Deal Analyst',
    emoji: '📊',
    description: 'CRE deal analysis, market research, financial modeling.',
    systemPrompt: 'You are a CRE deal analyst. Focus on analyzing commercial real estate opportunities, cap rates, and market dynamics.',
  },
  {
    id: 'engineer',
    name: 'Staff Engineer',
    emoji: '⚡',
    description: 'Architecture, code reviews, technical deep-dives.',
    systemPrompt: 'You are a Staff Engineer. Focus on system design, code quality, and technical excellence.',
  },
  {
    id: 'writer',
    name: 'Content Writer',
    emoji: '✍️',
    description: 'Blog posts, documentation, marketing copy.',
    systemPrompt: 'You are a content writer. Focus on clear, engaging writing for technical and marketing content.',
  },
];

class AgentsAPI {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = CONFIG.GATEWAY_URL;
    this.token = CONFIG.GATEWAY_TOKEN;
  }

  // Get predefined agent configs
  getAgentConfigs(): AgentConfig[] {
    return AGENT_CONFIGS;
  }

  // Get a specific agent config
  getAgentConfig(id: string): AgentConfig | undefined {
    return AGENT_CONFIGS.find(a => a.id === id);
  }

  // Chat with a specific agent
  async chat(agentId: string, message: string): Promise<string> {
    const config = this.getAgentConfig(agentId);
    
    const messages: Array<{ role: string; content: string }> = [];
    
    // Add system prompt if agent has one
    if (config?.systemPrompt) {
      messages.push({ role: 'system', content: config.systemPrompt });
    }
    
    messages.push({ role: 'user', content: message });

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-clawdbot-agent-id': agentId === 'main' ? 'main' : 'main',
        'x-clawdbot-channel': 'mobile',
      },
      body: JSON.stringify({
        model: 'clawdbot:main',
        messages,
        user: `dom-${agentId}`, // Separate session per agent type
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  // Sync conversation to server for daily summary
  async syncConversation(
    agentId: string,
    messages: Array<{ role: string; content: string; timestamp: string }>
  ): Promise<void> {
    // Send conversation to main agent for logging
    const summary = messages
      .map(m => `[${m.role}]: ${m.content.slice(0, 100)}...`)
      .join('\n');

    await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-clawdbot-agent-id': 'main',
        'x-clawdbot-channel': 'mobile-sync',
      },
      body: JSON.stringify({
        model: 'clawdbot:main',
        messages: [{
          role: 'user',
          content: `[MOBILE SYNC] Log this conversation from agent "${agentId}":\n\n${summary}\n\nSave to /root/clawd/vault/obsidian/LifeOS/Mobile/conversations/ and respond with HEARTBEAT_OK`,
        }],
        user: 'dom-sync',
      }),
    });
  }
}

export const agentsAPI = new AgentsAPI();
