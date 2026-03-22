import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function InventoryItem({ item, onDelete }: any) {
  const isLow = item.quantity <= item.threshold;
  return (
    <View style={[styles.card, isLow && styles.lowStockCard]}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.itemName}</Text>
        <Text style={styles.meta}>Qty: {item.quantity} / Threshold: {item.threshold}</Text>
        <Text style={styles.meta}>Category: {item.category}</Text>
      </View>
      {isLow && <View style={styles.badge}><Text style={styles.badgeText}>LOW</Text></View>}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item._id)}>
        <Text style={styles.btnText}>Del</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2, alignItems: 'center' },
  lowStockCard: { borderLeftWidth: 4, borderLeftColor: '#e53e3e' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666', marginTop: 4 },
  badge: { backgroundColor: '#e53e3e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#e53e3e', padding: 8, borderRadius: 4 },
  btnText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});