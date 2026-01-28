// Clawdbot Gateway API Client - OpenAI Compatible
import { CONFIG } from '../constants/config';

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
  // Routes to main agent session for unified experience
  async send(
    message: string,
    userId: string = 'dom'
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-clawdbot-agent-id': 'main',
        'x-clawdbot-channel': 'mobile',
      },
      body: JSON.stringify({
        model: 'clawdbot:main',
        messages: [{ role: 'user', content: message }],
        user: 'dom',
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message?.content || '';
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
