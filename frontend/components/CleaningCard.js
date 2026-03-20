import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CleaningCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.type}</Text>
      <Text>Scheduled: {item.scheduledDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#e9e9e9', marginBottom: 8, borderRadius: 8 },
  title: { fontWeight: 'bold' }
});
