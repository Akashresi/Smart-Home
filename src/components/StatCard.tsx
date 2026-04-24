import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface StatCardProps {
  title: string;
  count: string | number;
  icon: keyof typeof Ionicons.prototype.props.name;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ title, count, icon, color, subtitle }: StatCardProps) {
  const { colors } = useTheme();
  const activeColor = color || colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.neutral[50] }]}>
      <View style={[styles.iconWrapper, { backgroundColor: activeColor + '15' }]}>
        <Ionicons name={icon as any} size={22} color={activeColor} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.neutral[500] }]}>{title}</Text>
        <Text style={[styles.count, { color: colors.black }]}>{count}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.neutral[400] }]}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: spacing.md, 
    borderRadius: 24, 
    flex: 1, 
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  info: {
    gap: 2,
  },
  title: { 
    fontSize: 11, 
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  count: { 
    fontSize: 22, 
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
  }
});