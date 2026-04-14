import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { colors, spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'outline' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease-in-out',
      }
    })
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  flat: {
    backgroundColor: colors.neutral[50],
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: 'transparent',
  },
  glass: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }
});
