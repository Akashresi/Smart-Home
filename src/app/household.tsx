import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import householdService from '@/services/householdService';

export default function HouseholdScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [createName, setCreateName] = useState('');

  const fetch = async() => { setLoading(true); try { const r = await householdService.getMembers(); setMembers(r.data); } catch{} finally{setLoading(false);}}
  useEffect(() => { fetch(); }, []);

  const create = async() => { await householdService.createHousehold(createName); fetch(); }
  const join = async() => { await householdService.joinHousehold(inviteCode); fetch(); }

  if (loading) return <ActivityIndicator style={{marginTop: 50}} />
  
  if (members.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Join or Create a Household</Text>
        <TextInput placeholder="Household Name" value={createName} onChangeText={setCreateName} style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={create}><Text style={styles.btnText}>Create Household</Text></TouchableOpacity>
        <Text style={{textAlign:'center', marginVertical:20}}>OR</Text>
        <TextInput placeholder="Invite Code" value={inviteCode} onChangeText={setInviteCode} style={styles.input} />
        <TouchableOpacity style={styles.btnAlt} onPress={join}><Text style={styles.btnText}>Join Household</Text></TouchableOpacity>
      </View>
    );
  }

  return(
    <View style={styles.container}>
      <Text style={styles.header}>My Household</Text>
      {members.map(m => (
        <View key={m.uid} style={styles.card}>
          <Text style={styles.name}>{m.name}</Text>
          <Text style={styles.role}>{m.role}</Text>
        </View>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {flex:1, padding:20, backgroundColor: '#f7fafc'}, header: {fontSize:24, fontWeight:'bold', marginBottom:20},
  input: {backgroundColor:'white', padding:15, borderRadius:8, marginBottom:10, borderWidth:1, borderColor:'#ddd'},
  btn: {backgroundColor:'#48bb78', padding:15, borderRadius:8, alignItems:'center'}, btnText: {color:'white', fontWeight:'bold'},
  btnAlt: {backgroundColor:'#3182ce', padding:15, borderRadius:8, alignItems:'center'},
  card: {backgroundColor:'white', padding:15, borderRadius:8, marginBottom:10, flexDirection:'row', justifyContent:'space-between'},
  name: {fontSize:18, fontWeight:'bold'}, role: {color:'#718096'}
});