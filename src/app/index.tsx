import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import taskService from '@/services/taskService';
import inventoryService from '@/services/inventoryService';
import expenseService from '@/services/expenseService';
import alertService from '@/services/alertService';
import maintenanceService from '@/services/maintenanceService';
import aiService from '@/services/aiService';
import StatCard from '@/components/StatCard';
import AlertCard from '@/components/AlertCard';

export default function HomeScreen() {
  const [data, setData] = useState<any>({ tasks: 0, lowStock: 0, maintenance: 0, spend: 0 });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, iRes, eRes, aRes, mRes] = await Promise.all([
        taskService.getTasks(), inventoryService.getInventory(), expenseService.getExpenses(), alertService.getAlerts(), maintenanceService.getMaintenance()
      ]);
      const tasks = tRes.data.filter((t: any) => t.status !== 'completed').length;
      const inv = iRes.data.filter((i: any) => i.quantity <= i.threshold).length;
      const spend = eRes.data.reduce((acc: number, item: any) => acc + item.amount, 0);
      const maint = mRes.data.length;
      setData({ tasks, lowStock: inv, maintenance: maint, spend });
      setAlerts(aRes.data);

      const aiRes = await aiService.getSuggestions(iRes.data);
      setAiSuggestions(aiRes.data.suggestions || []);
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRead = async (id: string) => {
    await alertService.markRead(id);
    fetchData();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.row}>
        <StatCard title="Pending Tasks" count={data.tasks} color="#3182ce" />
        <StatCard title="Low Stock" count={data.lowStock} color="#e53e3e" />
      </View>
      <View style={styles.row}>
        <StatCard title="Due Maintenance" count={data.maintenance} color="#dd6b20" />
        <StatCard title="This Month Spend" count={`$${data.spend.toFixed(0)}`} color="#38a169" />
      </View>
      <Text style={styles.subHeader}>Recent Alerts</Text>
      {alerts.length === 0 ? <Text style={styles.empty}>No new alerts</Text> : alerts.map(a => <AlertCard key={a._id} alert={a} onRead={handleRead} />)}
      
      <Text style={styles.subHeader}>AI Suggestions</Text>
      {aiSuggestions.map((s, idx) => <Text key={idx} style={styles.aiItem}>💡 {s}</Text>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#2d3748' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#4a5568' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  empty: { color: '#a0aec0', fontStyle: 'italic' },
  aiItem: { backgroundColor: '#eebcf3', padding: 10, borderRadius: 8, marginVertical: 4, color: '#440055', fontWeight: 'bold' }
});