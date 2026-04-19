import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AlertCard from '@/components/AlertCard';
import alertService from '@/services/alertService';

import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/theme';
import { Button } from '@/components/ui/Button';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async() => { 
    try { 
      const r = await alertService.getAlerts(); 
      setAlerts(r.data); 
    } catch{} finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
  };

  useEffect(() => { fetch(); }, []);

  const markAll = async() => { await alertService.markAllRead(); fetch(); }
  const read = async(id: string) => { await alertService.markRead(id); fetch(); }

  if(loading && !refreshing) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.success} /></View>;

  return(
    <View style={styles.container}>
      {alerts.length > 0 && (
        <Button 
          title="Mark All Read" 
          onPress={markAll} 
          variant="outline"
          style={styles.markAllBtn}
        />
      )}
      <FlatList 
        data={alerts} 
        onRefresh={onRefresh} 
        refreshing={refreshing} 
        keyExtractor={i => i._id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => <AlertCard alert={item} onRead={read} />}
        ListEmptyComponent={
          <EmptyState 
            icon="notifications-off-outline" 
            title="All caught up!" 
            message="No new alerts at the moment. Your home is safe. 🛡️" 
          />
        } 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.neutral[50] },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  markAllBtn: {
    margin: theme.spacing.md,
    height: 48,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  }
});