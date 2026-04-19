import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Card } from './ui/Card';

export default function InventoryItem({ item, onDelete }: any) {
  const isLow = item.quantity <= item.threshold;
  const stockPercentage = Math.min((item.quantity / (item.threshold * 2)) * 100, 100);

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{item.itemName}</Text>
          <Text style={styles.category}>{item.category || 'General'}</Text>
          <View style={styles.stockInfo}>
            <Text style={[styles.quantity, isLow && { color: theme.colors.error }]}>
              {item.quantity} units left
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${stockPercentage}%`, backgroundColor: isLow ? theme.colors.error : theme.colors.success }]} />
            </View>
          </View>
        </View>
        <View style={styles.rightSide}>
          {isLow && (
            <View style={styles.lowBadge}>
              <Ionicons name="alert-circle" size={14} color="white" />
              <Text style={styles.lowText}>LOW</Text>
            </View>
          )}
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
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
  mainInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...theme.typography.presets.h3,
    color: theme.colors.neutral[800],
  },
  category: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[400],
    textTransform: 'capitalize',
  },
  stockInfo: {
    marginTop: 8,
    gap: 6,
  },
  quantity: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.neutral[600],
  },
  progressContainer: {
    height: 6,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 3,
    width: '80%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  rightSide: {
    alignItems: 'flex-end',
    gap: 12,
  },
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lowText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
  }
});