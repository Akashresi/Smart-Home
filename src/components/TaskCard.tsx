import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Card } from './ui/Card';

export default function TaskCard({ item, onComplete, onDelete }: any) {
  const isCompleted = item.status === 'completed';

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={[styles.priorityTab, { backgroundColor: item.priority === 'High' ? theme.colors.error : theme.colors.primary }]} />
        <View style={styles.info}>
          <Text style={[styles.title, isCompleted && styles.completedText]}>{item.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.footer}>
            <View style={styles.badge}>
              <Ionicons name="flag-outline" size={12} color={theme.colors.neutral[500]} />
              <Text style={styles.badgeText}>{item.priority}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={12} color={theme.colors.neutral[500]} />
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity style={styles.actionBtn} onPress={onComplete}>
              <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 0, 
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: theme.spacing.md,
  },
  priorityTab: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  info: { 
    flex: 1,
    gap: 4,
  },
  title: { 
    ...theme.typography.presets.h3,
    color: theme.colors.neutral[900],
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.neutral[400],
  },
  desc: { 
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.neutral[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.neutral[600],
  },
  actions: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: theme.spacing.md,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
  }
});