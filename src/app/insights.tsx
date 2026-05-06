import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import insightService, { InsightReport } from '../services/insightService';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function InsightsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [report, setReport] = useState<InsightReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    if (!user?.householdId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await insightService.getMonthlyInsights();
      setReport(response.data.report);
    } catch (error) {
      console.error('Failed to fetch insights', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInsights();
  }, []);

  if (loading && !refreshing) return <Loading message="Analyzing home data..." />;

  if (!user?.householdId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Home Insights' }} />
        <EmptyState 
          icon="home-outline" 
          title="No Household" 
          message="Join or create a household to see insights and reports." 
          onPress={() => router.push('/settings')}
          actionTitle="Go to Settings"
        />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Home Insights' }} />
        <EmptyState 
          icon="analytics-outline" 
          title="No Data Available" 
          message="Unable to load insights at this moment." 
        />
      </View>
    );
  }

  const completionRate = report.tasks.total > 0 
    ? Math.round((report.tasks.completed / report.tasks.total) * 100) 
    : 0;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <Stack.Screen options={{ title: 'Home Insights', headerBackTitle: 'Home' }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.black }]}>1-Month Analysis Report</Text>
        <Text style={[styles.subtitle, { color: colors.neutral[500] }]}>Overview of all home activities</Text>
      </View>

      <Card style={styles.summaryCard} variant="elevated">
        <View style={styles.summaryHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.summaryTitle, { color: colors.black }]}>Performance Score</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreValue, { color: colors.primary }]}>{completionRate}%</Text>
          <Text style={[styles.scoreLabel, { color: colors.neutral[500] }]}>Task Completion Rate</Text>
        </View>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <View style={[styles.gridIconWrapper, { backgroundColor: colors.info + '15' }]}>
            <Ionicons name="checkbox-outline" size={20} color={colors.info} />
          </View>
          <Text style={[styles.gridValue, { color: colors.black }]}>{report.tasks.completed}/{report.tasks.total}</Text>
          <Text style={[styles.gridLabel, { color: colors.neutral[500] }]}>Tasks Completed</Text>
        </Card>

        <Card style={styles.gridCard}>
          <View style={[styles.gridIconWrapper, { backgroundColor: colors.warning + '15' }]}>
            <Ionicons name="wallet-outline" size={20} color={colors.warning} />
          </View>
          <Text style={[styles.gridValue, { color: colors.black }]}>${report.expenses.totalSpent.toLocaleString()}</Text>
          <Text style={[styles.gridLabel, { color: colors.neutral[500] }]}>Total Spent</Text>
        </Card>

        <Card style={styles.gridCard}>
          <View style={[styles.gridIconWrapper, { backgroundColor: colors.success + '15' }]}>
            <Ionicons name="sparkles-outline" size={20} color={colors.success} />
          </View>
          <Text style={[styles.gridValue, { color: colors.black }]}>{report.cleaning.completed}</Text>
          <Text style={[styles.gridLabel, { color: colors.neutral[500] }]}>Cleanings Done</Text>
        </Card>

        <Card style={styles.gridCard}>
          <View style={[styles.gridIconWrapper, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="build-outline" size={20} color={colors.error} />
          </View>
          <Text style={[styles.gridValue, { color: colors.black }]}>{report.maintenance.completed}</Text>
          <Text style={[styles.gridLabel, { color: colors.neutral[500] }]}>Fixes Applied</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.black }]}>Detailed Breakdown</Text>
        
        <View style={[styles.row, { borderBottomColor: colors.neutral[200] }]}>
          <Text style={[styles.rowLabel, { color: colors.neutral[700] }]}>Pending Tasks</Text>
          <Text style={[styles.rowValue, { color: colors.black }]}>{report.tasks.pending}</Text>
        </View>
        
        <View style={[styles.row, { borderBottomColor: colors.neutral[200] }]}>
          <Text style={[styles.rowLabel, { color: colors.neutral[700] }]}>Pending Fixes</Text>
          <Text style={[styles.rowValue, { color: colors.black }]}>{report.maintenance.pending}</Text>
        </View>
        
        <View style={[styles.row, { borderBottomColor: colors.neutral[200], borderBottomWidth: 0 }]}>
          <Text style={[styles.rowLabel, { color: colors.neutral[700] }]}>Pending Cleanings</Text>
          <Text style={[styles.rowValue, { color: colors.black }]}>{report.cleaning.pending}</Text>
        </View>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
  },
  summaryCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  gridCard: {
    width: '48%',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  gridIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gridValue: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 2,
  },
  gridLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
  },
  rowValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
});
