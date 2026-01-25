// Clawdbot Gateway API Client
import { CONFIG } from '../constants/config';
import type { Session, GatewayEvent } from '../types';

class GatewayClient {
  private baseUrl: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, (event: GatewayEvent) => void> = new Map();

  constructor() {
    this.baseUrl = CONFIG.GATEWAY_URL;
    this.wsUrl = CONFIG.GATEWAY_WS_URL;
  }

  // List active sessions
  async getSessions(): Promise<Session[]> {
    const res = await fetch(`${this.baseUrl}${CONFIG.API.SESSIONS}`);
    if (!res.ok) throw new Error(`Failed to get sessions: ${res.status}`);
    return res.json();
  }

  // Spawn a new session
  async spawn(options: {
    label?: string;
    model?: string;
    channel?: string;
  } = {}): Promise<{ sessionId: string }> {
    const res = await fetch(`${this.baseUrl}${CONFIG.API.SPAWN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: options.label || 'mobile',
        model: options.model || 'anthropic/claude-sonnet-4',
        channel: options.channel || 'mobile',
      }),
    });
    if (!res.ok) throw new Error(`Failed to spawn session: ${res.status}`);
    return res.json();
  }

  // Send a message to a session
  async send(sessionId: string, message: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${CONFIG.API.SEND}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        message,
      }),
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
  }

  // Send message and get streaming response
  async sendAndStream(
    sessionId: string,
    message: string,
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}${CONFIG.API.SEND}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        message,
        stream: true,
      }),
    });

    if (!res.ok) {
      onError(`Failed to send: ${res.status}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError('No response body');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Parse SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onDone();
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch {
                // Raw text chunk
                onChunk(data);
              }
            }
          }
        }
      }
      onDone();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Stream error');
    }
  }

  // Connect to WebSocket for real-time events
  connect(onEvent: (event: GatewayEvent) => void): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`${this.wsUrl}/ws`);

    this.ws.onopen = () => {
      console.log('Gateway WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as GatewayEvent;
        onEvent(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('Gateway WebSocket error:', err);
    };

    this.ws.onclose = () => {
      console.log('Gateway WebSocket closed');
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export singleton instance
export const gateway = new GatewayClient();
