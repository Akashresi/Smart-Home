import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function TaskCard({ item, onComplete, onDelete }: any) {
  const { colors } = useTheme();
  const isCompleted = item.status === 'completed';

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={[styles.priorityTab, { backgroundColor: item.priority === 'High' ? colors.error : colors.primary }]} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.black }, isCompleted && styles.completedText]}>{item.title}</Text>
          <Text style={[styles.desc, { color: colors.neutral[500] }]} numberOfLines={2}>{item.description}</Text>
          <View style={styles.footer}>
            <View style={[styles.badge, { backgroundColor: colors.neutral[100] }]}>
              <Ionicons name="flag-outline" size={12} color={colors.neutral[500]} />
              <Text style={[styles.badgeText, { color: colors.neutral[600] }]}>{item.priority}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isCompleted ? colors.success + '15' : colors.neutral[100] }]}>
              <Ionicons 
                name={isCompleted ? "checkmark-circle" : "time-outline"} 
                size={12} 
                color={isCompleted ? colors.success : colors.neutral[500]} 
              />
              <Text style={[
                styles.badgeText, 
                { color: isCompleted ? colors.success : colors.neutral[600] }
              ]}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.neutral[50] }]} onPress={onComplete}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.neutral[50] }]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 0, 
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  priorityTab: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: spacing.md,
  },
  info: { 
    flex: 1,
    gap: 4,
  },
  title: { 
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  desc: { 
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  actions: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: spacing.md,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});