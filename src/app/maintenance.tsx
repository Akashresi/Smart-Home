import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import MaintenanceCard from '@/components/MaintenanceCard';
import maintenanceService from '@/services/maintenanceService';

export default function Maintenance() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async() => { setLoading(true); try { const r = await maintenanceService.getMaintenance(); setData(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const del = async (id: string) => { await maintenanceService.deleteMaintenance(id); fetch(); };
  const comp = async (id: string) => { await maintenanceService.updateMaintenance(id, {status: 'completed'}); fetch(); };

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator /></View>;
  return (
    <View style={{flex: 1, padding: 15, backgroundColor: '#f7fafc'}}>
      <FlatList data={data} onRefresh={fetch} refreshing={loading} keyExtractor={i => i._id}
        renderItem={({item}) => <MaintenanceCard item={item} onDelete={del} onComplete={comp}/>}
        ListEmptyComponent={<Text style={{textAlign: 'center'}}>No devices tracked yet.</Text>} />
    </View>
  );
}