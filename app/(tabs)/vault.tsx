// Vault Screen - Obsidian Browser
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

// Placeholder vault structure
const VAULT_FOLDERS = [
  { name: '00-Inbox', icon: 'file-tray' },
  { name: '02-Contacts', icon: 'people' },
  { name: '03-Companies', icon: 'business' },
  { name: '04-Properties', icon: 'location' },
  { name: '05-Intelligence', icon: 'bulb' },
  { name: 'Deals', icon: 'trending-up' },
  { name: 'Tasks', icon: 'checkbox' },
  { name: 'LifeOS', icon: 'rocket' },
];

export default function VaultScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vault</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholder}>
          <Ionicons name="folder-open" size={48} color={COLORS.textSecondary} />
          <Text style={styles.placeholderTitle}>Obsidian Vault</Text>
          <Text style={styles.placeholderText}>
            Vault sync coming in Phase 4
          </Text>
        </View>

        <View style={styles.folderList}>
          {VAULT_FOLDERS.map((folder) => (
            <TouchableOpacity key={folder.name} style={styles.folderItem}>
              <Ionicons name={folder.icon as any} size={24} color={COLORS.accent} />
              <Text style={styles.folderName}>{folder.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
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
  searchButton: {
    padding: 8,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  placeholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  folderList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
});
