// LifeOS Mobile Configuration
export const CONFIG = {
  // Clawdbot Gateway
  GATEWAY_URL: 'http://129.212.185.219:18789',
  GATEWAY_WS_URL: 'ws://129.212.185.219:18789',
  
  // API Endpoints
  API: {
    SESSIONS: '/api/sessions',
    SPAWN: '/api/spawn',
    SEND: '/api/send',
    EVENTS: '/api/events',
  },
  
  // Audio Recording
  AUDIO: {
    SAMPLE_RATE: 44100,
    CHANNELS: 1,
    BIT_DEPTH: 16,
  },
  
  // UI Colors (Dark theme)
  COLORS: {
    background: '#1a1a2e',
    surface: '#16213e',
    primary: '#0f3460',
    accent: '#e94560',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#2a2a4e',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
  },
} as const;
