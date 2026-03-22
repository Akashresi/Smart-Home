import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import AlertCard from '@/components/AlertCard';
import alertService from '@/services/alertService';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async() => { setLoading(true); try { const r = await alertService.getAlerts(); setAlerts(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const markAll = async() => { await alertService.markAllRead(); fetch(); }
  const read = async(id: string) => { await alertService.markRead(id); fetch(); }

  if(loading) return <ActivityIndicator style={{marginTop: 50}} />
  return(
    <View style={{flex:1, padding: 15}}>
      <TouchableOpacity onPress={markAll} style={{backgroundColor:'#3182ce', padding:10, borderRadius:8, marginBottom:10}}><Text style={{color:'white', textAlign:'center', fontWeight:'bold'}}>Mark All Read</Text></TouchableOpacity>
      <FlatList data={alerts} onRefresh={fetch} refreshing={loading} keyExtractor={i => i._id}
        renderItem={({item}) => <AlertCard alert={item} onRead={read} />}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>You're all caught up!</Text>} />
    </View>
  )
}