import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MaintenanceCard({ item, onComplete, onDelete }: any) {
  const isOverdue = new Date(item.dueDate) < new Date();
  return (
    <View style={[styles.card, isOverdue ? styles.overdue : null]}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.deviceName}</Text>
        <Text style={styles.meta}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <Text style={styles.meta}>Status: {item.status}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => onComplete(item._id)}><Text style={styles.btnText}>Done</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => onDelete(item._id)}><Text style={styles.btnText}>Del</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
  overdue: { borderLeftWidth: 4, borderLeftColor: '#e53e3e' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  actions: { justifyContent: 'space-around' },
  btn: { backgroundColor: '#48bb78', padding: 8, borderRadius: 4, marginBottom: 5 },
  deleteBtn: { backgroundColor: '#e53e3e' },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});