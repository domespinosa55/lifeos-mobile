# LifeOS Mobile

Your AI Chief of Staff in your pocket. A React Native + Expo mobile app that integrates with Clawdbot Gateway for seamless AI-powered productivity.

## Features (Phase 1 - MVP)

- ✅ **Tab Navigation** - Home, Chat, Vault, Agents, Profile
- ✅ **Chat Interface** - Text messaging with Clawdbot
- ✅ **Audio Recording** - Record voice memos with expo-av
- ✅ **Gateway Integration** - API client for Clawdbot Gateway
- ✅ **Dark Theme** - Modern dark UI

## Tech Stack

- **React Native + Expo** (managed workflow)
- **TypeScript** - Full type safety
- **Expo Router** - File-based navigation
- **Zustand** - State management
- **expo-av** - Audio recording

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Or Expo Go app on your phone

### Installation

```bash
cd lifeos-mobile
pnpm install
```

### Development

```bash
# Start Expo development server
pnpm start

# iOS (requires Mac)
pnpm ios

# Android
pnpm android
```

### Gateway Configuration

Edit `src/constants/config.ts` to set your Gateway URL:

```typescript
export const CONFIG = {
  GATEWAY_URL: 'http://your-gateway-ip:18789',
  // ...
};
```

## Project Structure

```
lifeos-mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Home screen
│   │   ├── chat.tsx        # Chat with Clawdbot
│   │   ├── vault.tsx       # Obsidian browser
│   │   ├── agents.tsx      # Agent management
│   │   └── profile.tsx     # Settings & profile
│   └── _layout.tsx         # Root layout
├── src/
│   ├── api/                # Gateway API client
│   ├── components/         # Reusable UI components
│   ├── constants/          # Config & theme
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript types
└── assets/                 # Images & icons
```

## Development Phases

- [x] **Phase 1: Foundation** - Navigation, Chat, Audio recording
- [ ] **Phase 2: Voice** - Whisper transcription, ElevenLabs TTS
- [ ] **Phase 3: Meeting Capture** - Background recording, entity extraction
- [ ] **Phase 4: Vault Sync** - Obsidian integration
- [ ] **Phase 5: Polish** - Notifications, widgets

## Contributing

This is part of the LifeOS ecosystem. See the main spec at `vault/obsidian/LifeOS/Mobile-App-MVP.md`.

## License

Proprietary - LifeOS
