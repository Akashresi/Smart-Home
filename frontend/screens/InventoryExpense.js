import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import InventoryItem from '../components/InventoryItem';
import ExpenseSummary from '../components/ExpenseSummary';
import inventoryService from '../services/inventoryService';
import expenseService from '../services/expenseService';

export default function InventoryExpense() {
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, expRes] = await Promise.all([
          inventoryService.getInventory(),
          expenseService.getExpenses()
        ]);
        setInventory(invRes.data);
        setExpenses(expRes.data);
      } catch (error) {
        console.error("Error fetching inventory/expenses:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      <FlatList
        data={inventory}
        keyExtractor={item => item._id || item.id}
        renderItem={({ item }) => <InventoryItem item={item} />}
      />
      
      <Text style={[styles.header, {marginTop: 20}]}>Recent Expenses</Text>
      <ExpenseSummary expenses={expenses} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold' }
});
