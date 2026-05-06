import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
  DeviceEventEmitter
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import maintenanceService from '../services/maintenanceService';
import aiService from '../services/aiService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import MaintenanceCard from '../components/MaintenanceCard';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function MaintenanceScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Form State
  const [deviceName, setDeviceName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maintenanceSuggestions = ['AC Filter', 'Water Purifier', 'Smoke Alarm', 'Pest Control', 'Deep Clean'];

  const fetchData = async () => {
    if (!user?.householdId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await maintenanceService.getMaintenanceTasks();
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch maintenance tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (modalVisible || completeModalVisible) {
      DeviceEventEmitter.emit('hideTabBar');
    } else {
      DeviceEventEmitter.emit('showTabBar');
    }
    return () => { DeviceEventEmitter.emit('showTabBar'); };
  }, [modalVisible, completeModalVisible]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!deviceName || !dueDate) {
      Alert.alert('Error', 'Please fill in device name and date');
      return;
    }

    try {
      setIsSubmitting(true);
      await maintenanceService.createMaintenanceTask({
        deviceName,
        taskDescription,
        dueDate,
        status: 'pending'
      });
      setModalVisible(false);
      resetForm();
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);
      await maintenanceService.updateMaintenanceTask(selectedTask._id, {
        status: 'completed',
        cost: cost ? parseFloat(cost) : 0
      });
      setCompleteModalVisible(false);
      setSelectedTask(null);
      setCost('');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await maintenanceService.deleteMaintenanceTask(id);
          fetchData();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete task');
        }
      }}
    ]);
  };

  const resetForm = () => {
    setDeviceName('');
    setTaskDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
  };

  const handleScanBill = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to scan bills.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      try {
        setIsSubmitting(true);
        const response = await aiService.scanBill(result.assets[0].base64);
        
        if (response.data.type === 'maintenance') {
           setDeviceName(response.data.data.deviceName || '');
           setTaskDescription(response.data.data.taskDescription || '');
        } else {
           Alert.alert('AI Notice', 'This bill appears to be for Inventory, but we filled what we could.');
           setDeviceName(response.data.data.itemName || '');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to scan bill. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList 
        data={tasks} 
        renderItem={({ item }) => (
          <MaintenanceCard 
            item={item} 
            onDelete={() => handleDelete(item._id)} 
            onComplete={() => {
              setSelectedTask(item);
              setCompleteModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.black }]}>Home Maintenance</Text>
            <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
              {tasks.filter(t => t.status === 'pending').length} tasks pending attention
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState 
            icon="construct-outline" 
            title="All clear" 
            message="No maintenance tasks found. Tap the + button to Schedule a checkup! ✨" 
          />
        } 
      />

      <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.fabContainer}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient 
          colors={['#4FACFE', '#00F2FE']} 
          style={styles.fab}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={32} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Schedule Maintenance</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleScanBill} style={styles.scanButton}>
                  <Ionicons name="camera-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.neutral[500]} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
              <View style={styles.chipScrollContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {maintenanceSuggestions.map(s => (
                    <TouchableOpacity key={s} style={styles.chip} onPress={() => setDeviceName(s)}>
                      <Text style={styles.chipText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Input
                label="Device/Area Name"
                placeholder="e.g. AC Filter, Water Purifier"
                value={deviceName}
                onChangeText={setDeviceName}
              />

              <Input
                label="Task Description"
                placeholder="e.g. Cleaning filter, checking leaks"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />

              <Input
                label="Due Date"
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
              />

              <Button 
                title="Schedule Task" 
                onPress={handleAddTask} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Complete Task Modal */}
      <Modal visible={completeModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.black }]}>Complete Task</Text>
              <TouchableOpacity onPress={() => setCompleteModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContent}>
              <Text style={[styles.confirmText, { color: colors.neutral[700] }]}>
                Marking "{selectedTask?.deviceName}" as completed.
              </Text>
              
              <Input
                label="Maintenance Cost ($)"
                placeholder="0.00"
                keyboardType="numeric"
                value={cost}
                onChangeText={setCost}
              />
              <Text style={styles.helperText}>Adding cost will automatically create a spending entry.</Text>

              <Button 
                title="Complete Task" 
                onPress={handleCompleteTask} 
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerTitleContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xl,
    elevation: 8,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  formContent: {
    paddingBottom: spacing['2xl'],
  },
  confirmText: {
    fontSize: 16,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.medium,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: -8,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  chipScrollContainer: {
    marginBottom: spacing.md,
  },
  chipScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  chipText: {
    fontSize: 13,
    color: '#4FACFE',
    fontFamily: typography.fontFamily.bold,
  },
  scanButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 8,
  },
});