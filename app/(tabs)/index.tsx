// Home Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';
import { RecordButton } from '../../src/components/RecordButton';
import { useAudioStore } from '../../src/stores/audioStore';

const { COLORS } = CONFIG;

export default function HomeScreen() {
  const router = useRouter();
  const { isRecording, isPaused, duration, startRecording, stopRecording, requestPermission } =
    useAudioStore();

  const handleRecordPress = async () => {
    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        console.log('Recording saved:', recording.uri);
      }
    } else {
      await requestPermission();
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LifeOS</Text>
          <Text style={styles.subtitle}>Your AI Chief of Staff</Text>
        </View>

        {/* Main Action: Talk */}
        <TouchableOpacity
          style={styles.talkButton}
          onPress={() => router.push('/chat')}
        >
          <Ionicons name="mic" size={32} color={COLORS.text} />
          <Text style={styles.talkButtonText}>Talk to Me</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="document-text" size={28} color={COLORS.accent} />
            <Text style={styles.actionLabel}>Quick Note</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="recording" size={28} color={COLORS.accent} />
            <Text style={styles.actionLabel}>Record Meeting</Text>
          </TouchableOpacity>
        </View>

        {/* Recording Control */}
        <View style={styles.recordSection}>
          <Text style={styles.sectionTitle}>Voice Recording</Text>
          <RecordButton
            isRecording={isRecording}
            isPaused={isPaused}
            duration={duration}
            onPress={handleRecordPress}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.activityText}>Connected to Gateway</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="time" size={20} color={COLORS.textSecondary} />
              <Text style={styles.activityText}>Ready to chat...</Text>
            </View>
          </View>
        </View>

        {/* Agents Summary */}
        <TouchableOpacity
          style={styles.agentsCard}
          onPress={() => router.push('/agents')}
        >
          <View style={styles.agentsHeader}>
            <Text style={styles.agentsTitle}>Agents</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.agentsSubtitle}>Tap to view your AI agents</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  talkButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  talkButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  recordSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  activityList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.text,
  },
  agentsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  agentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  agentsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
