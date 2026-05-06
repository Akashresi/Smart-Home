import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import alertService from '../services/alertService';
import AlertCard from '../components/AlertCard';
import EmptyState from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.householdId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await alertService.getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await alertService.markAllRead();
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleRead = async (id: string) => {
    try {
      await alertService.markRead(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBroadcast = (title: string) => {
    Alert.alert('Broadcast Alert', `Broadcast a ${title} to everyone in the household?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Broadcast', style: 'destructive', onPress: async () => {
        try {
          await alertService.broadcastAlert('emergency', title);
          Alert.alert('Success', 'Alert sent to all members');
        } catch (error) {
          Alert.alert('Error', 'Failed to broadcast alert');
        }
      }}
    ]);
  };

  if (loading && !refreshing) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={alerts}
        renderItem={({ item }) => (
          <AlertCard alert={item} onRead={() => handleRead(item._id)} />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <>
            <View style={styles.emergencyContainer}>
              <Text style={[styles.sectionTitle, { color: colors.black }]}>Emergency Broadcast</Text>
              <View style={styles.broadcastGrid}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleBroadcast('Fire Alert')}>
                  <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.broadcastBtn} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                    <Ionicons name="flame" size={48} color="white" />
                    <Text style={[styles.broadcastText, { color: 'white' }]}>FIRE</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleBroadcast('Gas Leak')}>
                  <LinearGradient colors={['#F2994A', '#F2C94C']} style={styles.broadcastBtn} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                    <Ionicons name="warning" size={48} color="white" />
                    <Text style={[styles.broadcastText, { color: 'white' }]}>GAS LEAK</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleBroadcast('Security Alert')}>
                  <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.broadcastBtn} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                    <Ionicons name="shield" size={48} color="white" />
                    <Text style={[styles.broadcastText, { color: 'white' }]}>SECURITY</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            {alerts.length > 0 && (
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerRow}>
                  <View>
                    <Text style={[styles.headerTitle, { color: colors.black }]}>Notifications</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.neutral[500] }]}>
                      {alerts.filter(a => !a.isRead).length} unread alerts
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emergencyContainer: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  broadcastGrid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  broadcastBtn: {
    width: '100%',
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  broadcastText: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 2,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerTitleContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
});