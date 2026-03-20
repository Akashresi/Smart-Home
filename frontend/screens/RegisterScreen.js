import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // admin or user

  const handleRegister = async () => {
    // Beginner Note: Replace this block with Firebase Authentication
    // Example: const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
    // Then save the user role to MongoDB via your API
    if (email && password) {
      Alert.alert('Success', `Registered as ${role} successfully (Mock)`);
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register New Account</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <View style={{ marginBottom: 10 }}>
        <Text>Role:</Text>
        <Button title={role === 'user' ? "Set as Admin" : "Set as User"} onPress={() => setRole(role === 'user' ? 'admin' : 'user')} />
      </View>
      <Button title="Register" onPress={handleRegister} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});
