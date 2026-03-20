import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import TaskCard from '../components/TaskCard';
import cleaningService from '../services/cleaningService';
import taskService from '../services/taskService';

export default function TaskAndCleaning() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Mock load
    setTasks([
      { id: '1', type: 'Task', title: 'Buy groceries', status: 'pending' },
      { id: '2', type: 'Cleaning', title: 'Vacuum Living Room', status: 'scheduled' }
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks & Cleaning Schedule</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 }
});
