import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import InventoryItem from '../components/InventoryItem';
import ExpenseSummary from '../components/ExpenseSummary';
import inventoryService from '../services/inventoryService';
import expenseService from '../services/expenseService';

export default function InventoryExpense() {
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [invRes, expRes] = await Promise.all([
          inventoryService.getInventory(),
          expenseService.getExpenses()
        ]);
        setInventory(invRes.data);
        setExpenses(expRes.data);
      } catch (err) {
        console.error("Error fetching inventory/expenses:", err);
        setError("Failed to load inventory and expenses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      <FlatList
        data={inventory}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        renderItem={({ item }) => <InventoryItem item={item} />}
      />
      
      <Text style={[styles.header, {marginTop: 20, marginBottom: 10}]}>Recent Expenses</Text>
      <ExpenseSummary expenses={expenses} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16 }
});
