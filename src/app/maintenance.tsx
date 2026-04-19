import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import MaintenanceCard from '@/components/MaintenanceCard';
import maintenanceService from '@/services/maintenanceService';
import { theme } from '@/theme';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Maintenance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async() => { 
    try { 
      const r = await maintenanceService.getMaintenance(); 
      setData(r.data); 
    } catch{} finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
  }

  useEffect(() => { fetch(); }, []);

  const del = async (id: string) => { await maintenanceService.deleteMaintenance(id); fetch(); };
  const comp = async (id: string) => { await maintenanceService.updateMaintenance(id, {status: 'completed'}); fetch(); };

  if (loading && !refreshing) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.success} /></View>;

  return (
    <View style={styles.container}>
      <FlatList 
        data={data} 
        onRefresh={onRefresh} 
        refreshing={refreshing} 
        keyExtractor={i => i._id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => <MaintenanceCard item={item} onDelete={del} onComplete={comp}/>}
        ListEmptyComponent={
          <EmptyState 
            icon="shield-checkmark-outline" 
            title="All clear" 
            message="No maintenance required at the moment! ✨" 
          />
        } 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.neutral[50] },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  }
});