// Audio Store - Recording state management
import { create } from 'zustand';
import { Audio } from 'expo-av';
import type { Recording } from '../types';

interface AudioState {
  isRecording: boolean;
  isPaused: boolean;
  currentRecording: Audio.Recording | null;
  recordings: Recording[];
  duration: number;
  error: string | null;
  hasPermission: boolean;
  
  // Actions
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Recording | null>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  deleteRecording: (id: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  currentRecording: null,
  recordings: [],
  duration: 0,
  error: null,
  hasPermission: false,

  requestPermission: async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      set({ hasPermission: granted });
      
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }
      
      return granted;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Permission error' });
      return false;
    }
  },

  startRecording: async () => {
    const { hasPermission } = get();
    
    if (!hasPermission) {
      const granted = await get().requestPermission();
      if (!granted) {
        set({ error: 'Microphone permission denied' });
        return;
      }
    }

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      set({
        currentRecording: recording,
        isRecording: true,
        isPaused: false,
        duration: 0,
        error: null,
      });

      // Update duration every second
      const interval = setInterval(async () => {
        const state = get();
        if (state.isRecording && !state.isPaused && state.currentRecording) {
          const status = await state.currentRecording.getStatusAsync();
          if (status.isRecording) {
            set({ duration: Math.floor(status.durationMillis / 1000) });
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Recording failed' });
    }
  },

  stopRecording: async () => {
    const { currentRecording, recordings } = get();
    
    if (!currentRecording) return null;

    try {
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
      const status = await currentRecording.getStatusAsync();
      
      if (!uri) {
        set({ error: 'No recording URI' });
        return null;
      }

      const newRecording: Recording = {
        id: `recording-${Date.now()}`,
        uri,
        duration: Math.floor(status.durationMillis / 1000),
        createdAt: new Date(),
      };

      set({
        currentRecording: null,
        isRecording: false,
        isPaused: false,
        duration: 0,
        recordings: [...recordings, newRecording],
      });

      return newRecording;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Stop failed' });
      return null;
    }
  },

  pauseRecording: async () => {
    const { currentRecording } = get();
    if (currentRecording) {
      await currentRecording.pauseAsync();
      set({ isPaused: true });
    }
  },

  resumeRecording: async () => {
    const { currentRecording } = get();
    if (currentRecording) {
      await currentRecording.startAsync();
      set({ isPaused: false });
    }
  },

  deleteRecording: (id: string) => {
    set((state) => ({
      recordings: state.recordings.filter((r) => r.id !== id),
    }));
  },
}));
