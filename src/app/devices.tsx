import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SmartDeviceCard } from '@/components/SmartDeviceCard';
import { useRealtime } from '@/hooks/useRealtime';
import api from '@/services/api';
import { theme } from '@/theme';

export default function DevicesScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { on, emit } = useRealtime();

  const fetchDevices = async () => {
    try {
      const response = await api.get('/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to fetch devices', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();

    // Listen for real-time updates
    const cleanup = on('device:status_updated', (data: any) => {
      setDevices(prev => prev.map(d => 
        d._id === data.deviceId ? { ...d, status: data.status, value: data.value } : d
      ));
    });

    return cleanup;
  }, []);

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'on' ? 'off' : 
                        currentStatus === 'off' ? 'on' : 
                        currentStatus === 'locked' ? 'unlocked' : 
                        currentStatus === 'unlocked' ? 'locked' : currentStatus;
      
      // Optimistic update
      setDevices(prev => prev.map(d => d._id === id ? { ...d, status: newStatus } : d));
      
      await api.put(`/devices/${id}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to toggle device', error);
      fetchDevices(); // Rollback on error
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDevices();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Devices</Text>
        <Text style={styles.subtitle}>{devices.length} Devices Online</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {devices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices found in your household.</Text>
          </View>
        ) : (
          devices.map(device => (
            <SmartDeviceCard 
              key={device._id} 
              device={device} 
              onToggle={handleToggle}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  title: {
    ...theme.typography.presets.h1,
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[400],
  }
});
