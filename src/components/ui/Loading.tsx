import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface LoadingProps {
  message?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  overlay = false,
}) => {
  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },
  message: {
    ...typography.presets.body,
    marginTop: spacing.md,
    color: colors.neutral[600],
  },
});
