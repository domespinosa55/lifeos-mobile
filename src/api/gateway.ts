// Clawdbot Gateway API Client - OpenAI Compatible
import { CONFIG } from '../constants/config';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

class GatewayClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = CONFIG.GATEWAY_URL;
    this.token = CONFIG.GATEWAY_TOKEN;
  }

  // Send a message and get response (non-streaming)
  async send(
    message: string,
    userId: string = 'mobile-user'
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-clawdbot-agent-id': 'main',
      },
      body: JSON.stringify({
        model: 'clawdbot:main',
        messages: [{ role: 'user', content: message }],
        user: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  // Send message with streaming response
  async sendAndStream(
    message: string,
    userId: string = 'mobile-user',
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'x-clawdbot-agent-id': 'main',
        },
        body: JSON.stringify({
          model: 'clawdbot:main',
          messages: [{ role: 'user', content: message }],
          user: userId,
          stream: true,
        }),
      });

      if (!response.ok) {
        onError(`Gateway error: ${response.status}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError('No response body');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
      onDone();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Stream error');
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          model: 'clawdbot:main',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const gateway = new GatewayClient();
