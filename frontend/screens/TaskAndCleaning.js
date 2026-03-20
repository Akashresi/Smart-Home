import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import TaskCard from '../components/TaskCard';
import CleaningCard from '../components/CleaningCard';
import cleaningService from '../services/cleaningService';
import taskService from '../services/taskService';

export default function TaskAndCleaning() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, cleaningRes] = await Promise.all([
          taskService.getTasks(),
          cleaningService.getCleanings()
        ]);
        
        // Add a category property to distinguish them
        const tasks = taskRes.data.map(t => ({ ...t, category: 'task' }));
        const cleanings = cleaningRes.data.map(c => ({ ...c, category: 'cleaning' }));
        
        setItems([...tasks, ...cleanings]);
      } catch (error) {
        console.error("Error fetching tasks/cleanings:", error);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks & Cleaning Schedule</Text>
      <FlatList
        data={items}
        keyExtractor={item => item._id || item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
