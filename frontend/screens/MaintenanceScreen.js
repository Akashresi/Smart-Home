import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaintenanceCard from '../components/MaintenanceCard';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Schedule</Text>
      <MaintenanceCard item={{ deviceName: 'AC Filter', dueDate: '2023-11-01', status: 'pending' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
