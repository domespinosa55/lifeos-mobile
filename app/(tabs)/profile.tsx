// Profile Screen - With conversation sync
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';
import { useConversationStore } from '../../src/stores/conversationStore';
import { agentsAPI } from '../../src/api/agents';

const { COLORS } = CONFIG;

export default function ProfileScreen() {
  const [syncing, setSyncing] = useState(false);
  const { conversations, clearAllConversations, getAllConversationsForDay } = useConversationStore();
  
  const conversationCount = Object.keys(conversations).length;
  const todayConversations = getAllConversationsForDay();

  const handleSyncConversations = async () => {
    if (todayConversations.length === 0) {
      Alert.alert('No Conversations', 'No conversations to sync today.');
      return;
    }

    setSyncing(true);
    try {
      for (const convo of todayConversations) {
        await agentsAPI.syncConversation(
          convo.agentId,
          convo.messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toString(),
          }))
        );
      }
      Alert.alert('Synced!', `${todayConversations.length} conversation(s) synced to server.`);
    } catch (err) {
      Alert.alert('Sync Failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSyncing(false);
    }
  };

  const handleClearConversations = () => {
    Alert.alert(
      'Clear All Conversations?',
      'This will delete all stored conversations on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearAllConversations();
            Alert.alert('Cleared', 'All conversations deleted.');
          }
        },
      ]
    );
  };

  const SETTINGS_ITEMS = [
    { icon: 'server', label: 'Gateway Connection', value: 'Connected' },
    { icon: 'moon', label: 'Theme', value: 'Dark' },
    { icon: 'notifications', label: 'Notifications', value: '' },
    { icon: 'information-circle', label: 'About', value: 'v1.0.0' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DE</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Dom Espinosa</Text>
            <Text style={styles.userEmail}>Connected to LifeOS</Text>
          </View>
        </View>

        {/* Gateway Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Gateway</Text>
            <View style={styles.statusValue}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Active Agents</Text>
            <Text style={styles.statusText}>{conversationCount}</Text>
          </View>
        </View>

        {/* Conversation Sync Section */}
        <View style={styles.syncSection}>
          <Text style={styles.sectionTitle}>Conversations</Text>
          
          <View style={styles.syncInfo}>
            <Ionicons name="chatbubbles" size={20} color={COLORS.accent} />
            <Text style={styles.syncInfoText}>
              {todayConversations.length} conversation(s) today
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleSyncConversations}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color={COLORS.text} />
            ) : (
              <Ionicons name="cloud-upload" size={20} color={COLORS.text} />
            )}
            <Text style={styles.syncButtonText}>
              {syncing ? 'Syncing...' : 'Sync to Server'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearConversations}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={styles.clearButtonText}>Clear Local History</Text>
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.settingsItem}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.accent} />
              <Text style={styles.settingsLabel}>{item.label}</Text>
              {item.value && (
                <Text style={styles.settingsValue}>{item.value}</Text>
              )}
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>LifeOS Mobile</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appBuild}>Connected to Clawdbot Gateway</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
  },
  statusUrl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  syncSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  syncInfoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  clearButtonText: {
    fontSize: 14,
    color: COLORS.error,
  },
  settingsList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  settingsValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  appBuild: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});
