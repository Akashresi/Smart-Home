import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api, { pb } from '@/services/api';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { theme } from '@/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create user in PocketBase
      const record = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: confirmPassword,
        name,
        role: 'member'
      });
      
      // Auto login
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // Sync to MongoDB via Express
      try {
        await api.post('/auth/register', { id: record.id, email, name });
      } catch (mongoErr) {
        console.error('Failed to sync to MongoDB', mongoErr);
        // Continue anyway as PB is the primary auth
      }
      
      await login(pb.authStore.token, authData.record);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subtitle}>Join our smart home community</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <Button
            title="Already have an account? Login"
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
            style={styles.linkBtn}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  header: {
    ...theme.typography.presets.h1,
    color: theme.colors.success,
  },
  subtitle: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  registerBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.success,
  },
  linkBtn: {
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.presets.caption,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});