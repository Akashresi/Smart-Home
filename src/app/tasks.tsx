import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import taskService from '../services/taskService';
import cleaningService from '../services/cleaningService';
import TaskCard from '../components/TaskCard';
import CleaningCard from '../components/CleaningCard';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function TasksScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        taskService.getTasks(), 
        cleaningService.getCleanings()
      ]);
      
      const tasks = tRes.data.map((t: any) => ({ ...t, kind: 'task' }));
      const cleans = cRes.data.map((c: any) => ({ ...c, kind: 'cleaning' }));
      
      const combined = [...tasks, ...cleans].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setItems(combined);
    } catch (err) { 
      console.error(err); 
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => { fetchData(); }, []);

  const delTask = async (id: string, kind: string) => {
    try {
      if (kind === 'task') await taskService.deleteTask(id);
      else await cleaningService.deleteCleaning(id);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete data');
    }
  };

  const compTask = async (id: string, kind: string) => {
    try {
      if (kind === 'task') await taskService.updateTask(id, { status: 'completed' });
      else await cleaningService.updateCleaning(id, { status: 'completed' });
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update data');
    }
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.black }]}>Daily Operations</Text>
            <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
              {items.filter(i => i.status !== 'completed').length} tasks remaining for today
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState 
            icon="rocket-outline" 
            title="No tasks yet 🚀" 
            message="Your home is all caught up! Add a new task or cleaning schedule to get started." 
          />
        }
        renderItem={({ item }) => item.kind === 'task' ? 
          <TaskCard item={item} onComplete={() => compTask(item._id, 'task')} onDelete={() => delTask(item._id, 'task')} /> :
          <CleaningCard item={item} onComplete={() => compTask(item._id, 'cleaning')} onDelete={() => delTask(item._id, 'cleaning')} />}
      />
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => Alert.alert('Add Task', 'Select type', [
            { text: 'General Task', onPress: () => {} },
            { text: 'Cleaning Task', onPress: () => {} },
            { text: 'Cancel', style: 'cancel' }
        ])}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerTitleContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});