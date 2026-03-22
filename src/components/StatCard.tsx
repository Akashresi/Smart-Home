import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, count, color = '#2b6cb0' }: any) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: 'white', borderRadius: 8, margin: 5, flex: 1, borderLeftWidth: 4, elevation: 2 },
  title: { fontSize: 14, color: '#666' },
  count: { fontSize: 24, fontWeight: 'bold', marginTop: 5 }
});