import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '@/components/StatCard';
import taskService from '@/services/taskService';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';
import alertService from '@/services/alertService';
import maintenanceService from '@/services/maintenanceService';
import aiService from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tasks: 0,
    inventory: 0,
    expenses: 0,
    alerts: 0,
    maintenance: 0,
  });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [predictedSavings, setPredictedSavings] = useState(0);

  const fetchData = async () => {
    try {
      const [tRes, iRes, eRes, aRes, mRes] = await Promise.all([
        taskService.getTasks(), 
        inventoryService.getInventory(), 
        expenseService.getExpenses(), 
        alertService.getAlerts(), 
        maintenanceService.getMaintenance()
      ]);

      setStats({
        tasks: tRes.data.length,
        inventory: iRes.data.length,
        expenses: eRes.data.reduce((sum: number, e: any) => sum + e.amount, 0),
        alerts: aRes.data.length,
        maintenance: mRes.data.length,
      });

      // Fetch AI Suggestions
      const aiRes = await aiService.getSuggestions(iRes.data);
      if (aiRes.data.suggestions) {
        setAiSuggestions(aiRes.data.suggestions);
      }
      
      const aiRec = await aiService.getDeviceRecommendations({ usage_history: [2, 4, 1, 5, 3] });
      if (aiRec.data.predictedSavings) {
        setPredictedSavings(aiRec.data.predictedSavings);
      }
    } catch (err) {
      console.error('Data fetch error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.success} />
        <Text style={styles.loadingText}>Synchronizing your home...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.success} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.neutral[800]} />
          {stats.alerts > 0 && <View style={styles.notifBadge} />}
        </TouchableOpacity>
      </View>

      <Card style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <View style={styles.aiTitleWrapper}>
            <View style={styles.aiIconWrapper}>
              <Ionicons name="sparkles" size={18} color="white" />
            </View>
            <Text style={styles.aiTitle}>Smart Insights</Text>
          </View>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>+${predictedSavings} saved</Text>
          </View>
        </View>
        
        {aiSuggestions.length > 0 ? (
          <View style={styles.suggestionList}>
            {aiSuggestions.slice(0, 2).map((s, i) => (
              <View key={i} style={styles.suggestionItem}>
                <Ionicons name="chevron-forward" size={14} color={theme.colors.success} />
                <Text style={styles.suggestionText}>{s}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noAiText}>All systems optimal. Your home is running efficiently! 🚀</Text>
        )}
      </Card>

      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatCard title="Tasks" count={stats.tasks} icon="list" color={theme.colors.primary} />
          <StatCard title="Inventory" count={stats.inventory} icon="cube" color={theme.colors.success} />
        </View>
        <View style={styles.row}>
          <StatCard title="Expenses" count={`$${stats.expenses.toFixed(0)}`} icon="wallet" color={theme.colors.warning} />
          <StatCard title="Alerts" count={stats.alerts} icon="notifications" color={theme.colors.error} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Home Operations</Text>
      <View style={styles.operationsGrid}>
        <OperationItem 
          title="Maintenance" 
          status={stats.maintenance > 0 ? `${stats.maintenance} pending` : 'All clear'} 
          icon="construct" 
          color={theme.colors.info}
          progress={0.7}
        />
        <OperationItem 
          title="Energy Usage" 
          status="Efficient" 
          icon="flash" 
          color="#FFD700"
          progress={0.4}
        />
      </View>
    </ScrollView>
  );
}

const OperationItem = ({ title, status, icon, color, progress }: any) => (
  <Card style={styles.opCard}>
    <View style={[styles.opIconWrapper, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.opInfo}>
      <Text style={styles.opTitle}>{title}</Text>
      <Text style={styles.opStatus}>{status}</Text>
      <View style={styles.progressBarWrapper}>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  content: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.neutral[500],
    ...theme.typography.presets.body,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
    fontSize: 14,
  },
  userName: {
    ...theme.typography.presets.h1,
    fontSize: 28,
    color: theme.colors.neutral[900],
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.error,
    borderWidth: 2,
    borderColor: 'white',
  },
  aiCard: {
    backgroundColor: theme.colors.neutral[900],
    padding: theme.spacing.lg,
    borderRadius: 24,
    marginBottom: theme.spacing.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  aiTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingsBadge: {
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionList: {
    gap: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  noAiText: {
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    fontSize: 14,
  },
  statsGrid: {
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  sectionTitle: {
    ...theme.typography.presets.h3,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  operationsGrid: {
    gap: theme.spacing.md,
  },
  opCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: 16,
  },
  opIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opInfo: {
    flex: 1,
    gap: 2,
  },
  opTitle: {
    ...theme.typography.presets.body,
    fontWeight: 'bold',
    color: theme.colors.neutral[800],
  },
  opStatus: {
    fontSize: 12,
    color: theme.colors.neutral[500],
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  }
});