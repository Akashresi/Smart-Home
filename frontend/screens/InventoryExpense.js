import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import InventoryItem from '../components/InventoryItem';
import ExpenseSummary from '../components/ExpenseSummary';

export default function InventoryExpense() {
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setInventory([
      { id: '1', itemName: 'Milk', quantity: 2, threshold: 1 }
    ]);
    setExpenses([
      { id: '1', category: 'Groceries', amount: 15 }
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory</Text>
      <FlatList
        data={inventory}
        keyExtractor={item => item.id}
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
