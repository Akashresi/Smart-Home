import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { theme } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SmartDeviceCardProps {
  device: {
    _id: string;
    name: string;
    type: string;
    status: string;
    value?: any;
    room?: string;
    icon?: string;
  };
  onToggle?: (id: string, currentStatus: string) => void;
  onPress?: (device: any) => void;
}

export const SmartDeviceCard: React.FC<SmartDeviceCardProps> = ({ device, onToggle, onPress }) => {
  const isActive = device.status === 'on' || device.status === 'unlocked' || device.status === 'online';
  
  const getIcon = () => {
    switch (device.type) {
      case 'light': return 'lightbulb';
      case 'lock': return device.status === 'locked' ? 'lock' : 'lock-open';
      case 'termostat': return 'thermometer';
      case 'camera': return 'video';
      case 'appliance': return 'power';
      default: return 'devices';
    }
  };

  const getStatusColor = () => {
    if (!isActive) return theme.colors.neutral[400];
    switch (device.type) {
      case 'light': return '#FFD700';
      case 'lock': return theme.colors.success;
      case 'termostat': return theme.colors.primary;
      default: return theme.colors.primary;
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.content} 
        onPress={() => onPress?.(device)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: isActive ? `${getStatusColor()}20` : theme.colors.neutral[100] }]}>
          <MaterialCommunityIcons 
            name={getIcon() as any} 
            size={24} 
            color={isActive ? getStatusColor() : theme.colors.neutral[500]} 
          />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{device.name}</Text>
          <Text style={styles.room}>{device.room || 'No Room'}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.toggle, { backgroundColor: isActive ? theme.colors.primary : theme.colors.neutral[200] }]}
          onPress={() => onToggle?.(device._id, device.status)}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleThumb, { alignSelf: isActive ? 'flex-end' : 'flex-start' }]} />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {device.value !== undefined && (
        <View style={styles.footer}>
          <Text style={styles.valueText}>
            {device.type === 'termostat' ? `${device.value}°C` : 
             device.type === 'light' ? `${device.value}% Brightness` : 
             device.value.toString()}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...theme.typography.presets.h3,
    fontSize: 16,
  },
  room: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  footer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[100],
  },
  valueText: {
    ...theme.typography.presets.caption,
    fontWeight: '600',
    color: theme.colors.primary,
  }
});
