import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import TaskCard from '@/components/TaskCard';
import CleaningCard from '@/components/CleaningCard';
import taskService from '@/services/taskService';
import cleaningService from '@/services/cleaningService';

export default function TasksScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, cRes] = await Promise.all([taskService.getTasks(), cleaningService.getCleanings()]);
      const tasks = tRes.data.map((t: any) => ({ ...t, kind: 'task' }));
      const cleans = cRes.data.map((c: any) => ({ ...c, kind: 'cleaning' }));
      setItems([...tasks, ...cleans].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch (err) { console.error(err); } finally { setLoading(false); }
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        refreshing={loading}
        onRefresh={fetchData}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first task!</Text>}
        renderItem={({ item }) => item.kind === 'task' ? 
          <TaskCard item={item} onComplete={() => compTask(item._id, 'task')} onDelete={() => delTask(item._id, 'task')} /> :
          <CleaningCard item={item} onComplete={() => compTask(item._id, 'clean')} onDelete={() => delTask(item._id, 'clean')} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: '#a0aec0', fontSize: 16 }
});