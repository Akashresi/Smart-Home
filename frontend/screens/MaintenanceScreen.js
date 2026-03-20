import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MaintenanceCard from '../components/MaintenanceCard';
import maintenanceService from '../services/maintenanceService';

export default function MaintenanceScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await maintenanceService.getMaintenance();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching maintenance data', error);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Schedule</Text>
      <FlatList
        data={items}
        keyExtractor={item => item._id || item.id}
        renderItem={({ item }) => <MaintenanceCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
