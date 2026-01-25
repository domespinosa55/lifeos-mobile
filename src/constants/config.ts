// LifeOS Mobile Configuration - 2026 Design System
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
  
  // UI Colors - 2026 Design System (Dark theme)
  COLORS: {
    // Backgrounds - Deep blacks
    background: '#09090b',      // Zinc 950 - Main background
    surface: '#18181b',         // Zinc 900 - Cards, panels
    surfaceElevated: '#27272a', // Zinc 800 - Elevated surfaces
    hover: '#3f3f46',           // Zinc 700 - Hover states
    
    // Glass effect
    glassBg: 'rgba(24, 24, 27, 0.8)',
    glassBorder: 'rgba(63, 63, 70, 0.5)',
    
    // Text
    text: '#fafafa',            // Zinc 50
    textSecondary: '#a1a1aa',   // Zinc 400
    textTertiary: '#71717a',    // Zinc 500
    
    // Accent - Electric Blue
    accent: '#3b82f6',          // Blue 500
    accentHover: '#60a5fa',     // Blue 400
    accentMuted: 'rgba(59, 130, 246, 0.15)',
    
    // Borders
    border: 'rgba(63, 63, 70, 0.5)',
    borderSubtle: 'rgba(63, 63, 70, 0.3)',
    
    // Status colors
    success: '#22c55e',         // Green 500
    warning: '#f59e0b',         // Amber 500
    error: '#ef4444',           // Red 500
    info: '#06b6d4',            // Cyan 500
    
    // Agent status
    agentActive: '#22c55e',
    agentIdle: '#3b82f6',
    agentThinking: '#f59e0b',
    agentError: '#ef4444',
    
    // Legacy compatibility
    primary: '#3b82f6',
  },
  
  // Spacing scale
  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  
  // Border radius
  RADIUS: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },
  
  // Font sizes
  FONT_SIZE: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
} as const;

// Type exports for TypeScript
export type Colors = typeof CONFIG.COLORS;
export type Spacing = typeof CONFIG.SPACING;
