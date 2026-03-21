import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import MaintenanceCard from '../components/MaintenanceCard';
import maintenanceService from '../services/maintenanceService';

export default function MaintenanceScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await maintenanceService.getMaintenance();
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching maintenance data', err);
        setError('Failed to load maintenance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Schedule</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        renderItem={({ item }) => <MaintenanceCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  errorText: { color: 'red', fontSize: 16 }
});
