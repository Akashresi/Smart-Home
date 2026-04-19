import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';

interface StatCardProps {
  title: string;
  count: string | number;
  icon: keyof typeof Ionicons.prototype.props.name;
  color?: string;
}

export default function StatCard({ title, count, icon, color = theme.colors.primary }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.count, { color: theme.colors.neutral[900] }]}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 16, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    margin: 6, 
    flex: 1, 
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[50],
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  info: {
    gap: 4,
  },
  title: { 
    fontSize: 12, 
    color: theme.colors.neutral[500],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  count: { 
    fontSize: 22, 
    fontWeight: 'bold',
  }
});