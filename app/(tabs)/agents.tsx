// Agents Screen - View and manage AI agents
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';
import type { Agent } from '../../src/types';

const { COLORS } = CONFIG;

// Placeholder agents
const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Main Agent',
    status: 'idle',
    description: 'Your primary AI assistant',
    lastMessage: 'Ready to help',
  },
  {
    id: '2',
    name: 'Head of Product',
    status: 'idle',
    description: 'Product development and UI',
    lastMessage: 'Standing by',
  },
  {
    id: '3',
    name: 'DealOS Analyst',
    status: 'working',
    description: 'CRE deal analysis',
    lastMessage: 'Analyzing Project Apex...',
  },
];

const STATUS_COLORS = {
  idle: COLORS.success,
  working: COLORS.accent,
  completed: COLORS.textSecondary,
  error: COLORS.error,
};

const STATUS_LABELS = {
  idle: 'Idle',
  working: 'Working',
  completed: 'Done',
  error: 'Error',
};

export default function AgentsScreen() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch agents from gateway
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderAgent = (agent: Agent) => (
    <TouchableOpacity key={agent.id} style={styles.agentCard}>
      <View style={styles.agentHeader}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[agent.status] }]} />
        <Text style={styles.agentName}>{agent.name}</Text>
        <Text style={styles.statusLabel}>{STATUS_LABELS[agent.status]}</Text>
      </View>
      
      {agent.description && (
        <Text style={styles.agentDescription}>{agent.description}</Text>
      )}
      
      {agent.lastMessage && (
        <View style={styles.lastMessage}>
          <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.lastMessageText} numberOfLines={1}>
            {agent.lastMessage}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agents</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agents.filter((a) => a.status === 'working').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agents.filter((a) => a.status === 'idle').length}</Text>
            <Text style={styles.statLabel}>Idle</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agents.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.agentList}>
          {agents.map(renderAgent)}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            Agents run on your Clawdbot Gateway. Tap an agent to view its conversation.
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  agentList: {
    gap: 12,
  },
  agentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  agentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  agentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  lastMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lastMessageText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
