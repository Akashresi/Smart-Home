import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AlertCard({ alert, onRead }: any) {
  return (
    <TouchableOpacity onPress={() => onRead(alert._id)} style={[styles.card, alert.read ? styles.read : styles.unread]}>
      <View style={styles.content}>
        <Text style={styles.message}>{alert.message}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 5, borderRadius: 8, elevation: 1 },
  unread: { backgroundColor: '#ffeebc' },
  read: { backgroundColor: '#f0f0f0' },
  content: { flexDirection: 'row', justifyContent: 'space-between' },
  message: { fontSize: 16 }
});