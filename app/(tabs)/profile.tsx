// Profile Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../src/constants/config';

const { COLORS } = CONFIG;

export default function ProfileScreen() {
  const SETTINGS_ITEMS = [
    { icon: 'server', label: 'Gateway Connection', value: 'Connected' },
    { icon: 'moon', label: 'Theme', value: 'Dark' },
    { icon: 'volume-high', label: 'Voice Settings', value: '' },
    { icon: 'notifications', label: 'Notifications', value: '' },
    { icon: 'key', label: 'API Keys', value: '' },
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
            <Ionicons name="person" size={32} color={COLORS.text} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>LifeOS User</Text>
            <Text style={styles.userEmail}>Connected to Gateway</Text>
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
            <Text style={styles.statusLabel}>URL</Text>
            <Text style={styles.statusUrl}>{CONFIG.GATEWAY_URL}</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {SETTINGS_ITEMS.map((item, index) => (
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
          <Text style={styles.appVersion}>Version 1.0.0 (Phase 1)</Text>
          <Text style={styles.appBuild}>Built with Expo + React Native</Text>
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
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    color: COLORS.success,
    fontWeight: '500',
  },
  statusUrl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  settingsList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
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
    marginTop: 32,
    padding: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  appBuild: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});
