import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Total Expenses: ${total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fee', borderRadius: 8 },
  title: { fontWeight: 'bold', color: 'red' }
});
