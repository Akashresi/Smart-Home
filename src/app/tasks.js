import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import TaskCard from '../components/TaskCard';
import CleaningCard from '../components/CleaningCard';
import cleaningService from '../services/cleaningService';
import taskService from '../services/taskService';

export default function TaskAndCleaning() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [taskRes, cleaningRes] = await Promise.all([
          taskService.getTasks(),
          cleaningService.getCleanings()
        ]);
        
        // Add a category property to distinguish them
        const tasks = taskRes.data.map(t => ({ ...t, category: 'task' }));
        const cleanings = cleaningRes.data.map(c => ({ ...c, category: 'cleaning' }));
        
        setItems([...tasks, ...cleanings]);
      } catch (err) {
        console.error("Error fetching tasks/cleanings:", err);
        setError('Failed to load tasks and cleanings.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    if (item.category === 'cleaning') {
      return <CleaningCard item={item} />;
    }
    return <TaskCard item={item} />;
  };

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
      <Text style={styles.header}>Tasks & Cleaning Schedule</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        renderItem={renderItem}
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
