import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Card } from './ui/Card';

export default function MaintenanceCard({ item, onComplete, onDelete }: any) {
  const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
  const isCompleted = item.status === 'completed';

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: isOverdue ? theme.colors.error + '15' : theme.colors.info + '15' }]}>
            <Ionicons 
              name={isCompleted ? "checkmark-done" : "construct-outline"} 
              size={24} 
              color={isOverdue ? theme.colors.error : (isCompleted ? theme.colors.success : theme.colors.info)} 
            />
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.title, isCompleted && styles.completedText]}>{item.deviceName}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={isOverdue ? theme.colors.error : theme.colors.neutral[400]} />
            <Text style={[styles.metaText, isOverdue && styles.overdueText]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isCompleted ? theme.colors.success + '10' : theme.colors.neutral[50] }]}>
            <Text style={[styles.statusText, { color: isCompleted ? theme.colors.success : theme.colors.neutral[500] }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity style={styles.actionBtn} onPress={onComplete}>
              <Ionicons name="checkbox-outline" size={22} color={theme.colors.success} />
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
  card: { padding: 0, marginBottom: theme.spacing.md },
  content: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { 
    flex: 1,
    gap: 4,
  },
  title: { 
    ...theme.typography.presets.h3,
    color: theme.colors.neutral[800],
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.neutral[400],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.neutral[500],
  },
  overdueText: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actions: { 
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 10,
  }
});