import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import InventoryItem from '@/components/InventoryItem';
import ExpenseSummary from '@/components/ExpenseSummary';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try { setLoading(true);
      const [iRes, eRes] = await Promise.all([inventoryService.getInventory(), expenseService.getExpenses()]);
      setInventory(iRes.data); setExpenses(eRes.data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const delInv = async (id: string) => { await inventoryService.deleteInventory(id); fetchData(); };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <ExpenseSummary expenses={expenses} />
      <Text style={styles.header}>Pantry & Inventory</Text>
      <FlatList data={inventory} refreshing={loading} onRefresh={fetchData} keyExtractor={i => i._id}
        renderItem={({ item }) => <InventoryItem item={item} onDelete={delInv} />}
        ListEmptyComponent={<Text style={{textAlign: 'center'}}>No items in inventory.</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 15 }, center: { flex: 1, justifyContent: 'center' }, header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }});