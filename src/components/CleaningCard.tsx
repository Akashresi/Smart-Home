import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CleaningCard({ item, onComplete, onDelete }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.type}</Text>
        <Text style={styles.meta}>Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</Text>
        <Text style={styles.meta}>Recurring: {item.recurring} | Status: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => onComplete(item._id)}><Text style={styles.btnText}>Done</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(item._id)}><Text style={styles.btnText}>Del</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#ebf8ff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2b6cb0' },
  meta: { fontSize: 12, color: '#4a5568', marginTop: 6 },
  actions: { justifyContent: 'space-around', alignItems: 'center' },
  btn: { backgroundColor: '#48bb78', padding: 8, borderRadius: 4, marginBottom: 5 },
  deleteBtn: { backgroundColor: '#e53e3e' },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});