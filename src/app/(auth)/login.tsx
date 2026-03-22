import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true); setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await SecureStore.setItemAsync('token', token);
      router.replace('/');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f7fafc' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#2d3748' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { backgroundColor: '#3182ce', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3182ce', fontSize: 14 },
  errorText: { color: '#e53e3e', marginBottom: 15, textAlign: 'center' }
});