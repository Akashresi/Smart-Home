import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function InventoryItem({ item, onDelete }: any) {
  const { colors } = useTheme();
  const isLow = item.quantity <= item.threshold;
  const stockPercentage = Math.min((item.quantity / (item.threshold * 2)) * 100, 100);

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={[styles.title, { color: colors.black }]}>{item.itemName}</Text>
          <Text style={[styles.category, { color: colors.neutral[400] }]}>{item.category || 'General'}</Text>
          <View style={styles.stockInfo}>
            <Text style={[styles.quantity, { color: isLow ? colors.error : colors.neutral[600] }]}>
              {item.quantity} units left
            </Text>
            <View style={[styles.progressContainer, { backgroundColor: colors.neutral[100] }]}>
              <View style={[styles.progressBar, { width: `${stockPercentage}%`, backgroundColor: isLow ? colors.error : colors.success }]} />
            </View>
          </View>
        </View>
        <View style={styles.rightSide}>
          {isLow && (
            <View style={[styles.lowBadge, { backgroundColor: colors.error }]}>
              <Ionicons name="alert-circle" size={14} color="white" />
              <Text style={styles.lowText}>LOW</Text>
            </View>
          )}
          <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.neutral[50] }]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, marginBottom: spacing.md },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  category: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
  stockInfo: {
    marginTop: 8,
    gap: 6,
  },
  quantity: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
  progressContainer: {
    height: 6,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lowText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
  deleteBtn: {
    padding: 10,
    borderRadius: 12,
  }
});