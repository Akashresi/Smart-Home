import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import InventoryItem from '@/components/InventoryItem';
import ExpenseSummary from '@/components/ExpenseSummary';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';

import { EmptyState } from '@/components/ui/EmptyState';
import { theme } from '@/theme';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [iRes, eRes] = await Promise.all([inventoryService.getInventory(), expenseService.getExpenses()]);
      setInventory(iRes.data); 
      setExpenses(eRes.data);
    } catch (err) {} finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  const delInv = async (id: string) => { await inventoryService.deleteInventory(id); fetchData(); };

  if (loading && !refreshing) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.success} /></View>;

  return (
    <View style={styles.container}>
      <ExpenseSummary expenses={expenses} />
      <Text style={styles.header}>Pantry & Inventory</Text>
      <FlatList 
        data={inventory} 
        refreshing={refreshing} 
        onRefresh={onRefresh} 
        keyExtractor={i => i._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <InventoryItem item={item} onDelete={delInv} />}
        ListEmptyComponent={
          <EmptyState 
            icon="basket-outline" 
            title="Empty pantry" 
            message="Start tracking your household items here! 🍎" 
          />
        } 
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, backgroundColor: theme.colors.neutral[50] }, 
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, 
  header: { 
    ...theme.typography.presets.h3,
    color: theme.colors.neutral[800],
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  }
});