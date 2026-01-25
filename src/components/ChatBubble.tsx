// Chat Bubble Component - 2026 Design System
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CONFIG } from '../constants/config';
import type { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <Animated.View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && (
          <View style={styles.agentHeader}>
            <View style={styles.agentDot} />
            <Text style={styles.roleLabel}>LifeOS</Text>
          </View>
        )}
        <Text style={[styles.content, isUser ? styles.userContent : styles.assistantContent]}>
          {message.content || '...'}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );
}

// Thinking indicator component
export function ThinkingIndicator() {
  return (
    <View style={[styles.container, styles.assistantContainer]}>
      <View style={[styles.bubble, styles.assistantBubble, styles.thinkingBubble]}>
        <View style={styles.agentHeader}>
          <View style={[styles.agentDot, styles.thinkingDot]} />
          <Text style={styles.roleLabel}>LifeOS is thinking...</Text>
        </View>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { animationDelay: '0ms' }]} />
          <View style={[styles.dot, { animationDelay: '160ms' }]} />
          <View style={[styles.dot, { animationDelay: '320ms' }]} />
        </View>
      </View>
    </View>
  );
}

const { COLORS, SPACING, RADIUS } = CONFIG;

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
  },
  userBubble: {
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: RADIUS.sm,
    // Subtle glow effect
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomLeftRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thinkingBubble: {
    paddingVertical: SPACING.base,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  agentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.agentActive,
    marginRight: SPACING.xs,
    // Glow effect
    shadowColor: COLORS.agentActive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  thinkingDot: {
    backgroundColor: COLORS.agentThinking,
    shadowColor: COLORS.agentThinking,
  },
  roleLabel: {
    fontSize: CONFIG.FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  content: {
    fontSize: CONFIG.FONT_SIZE.base,
    lineHeight: 24,
  },
  userContent: {
    color: '#ffffff',
  },
  assistantContent: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 4,
  },
});
