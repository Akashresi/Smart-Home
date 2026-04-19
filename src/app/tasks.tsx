import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import TaskCard from '@/components/TaskCard';
import CleaningCard from '@/components/CleaningCard';
import taskService from '@/services/taskService';
import cleaningService from '@/services/cleaningService';

import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/theme';

export default function TasksScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([taskService.getTasks(), cleaningService.getCleanings()]);
      const tasks = tRes.data.map((t: any) => ({ ...t, kind: 'task' }));
      const cleans = cRes.data.map((c: any) => ({ ...c, kind: 'cleaning' }));
      setItems([...tasks, ...cleans].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch (err) { console.error(err); } finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  const delTask = async (id: string, kind: string) => {
    if (kind === 'task') await taskService.deleteTask(id);
    else await cleaningService.deleteCleaning(id);
    fetchData();
  };

  const compTask = async (id: string, kind: string) => {
    if (kind === 'task') await taskService.updateTask(id, { status: 'completed' });
    else await cleaningService.updateCleaning(id, { status: 'completed' });
    fetchData();
  };

  if (loading && !refreshing) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.success} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            icon="rocket-outline" 
            title="No tasks yet" 
            message="Add your first task to see it here! 🚀" 
          />
        }
        renderItem={({ item }) => item.kind === 'task' ? 
          <TaskCard item={item} onComplete={() => compTask(item._id, 'task')} onDelete={() => delTask(item._id, 'task')} /> :
          <CleaningCard item={item} onComplete={() => compTask(item._id, 'cleaning')} onDelete={() => delTask(item._id, 'cleaning')} />}
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