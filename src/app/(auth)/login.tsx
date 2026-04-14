import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { pb } from '@/services/api';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { theme } from '@/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      await login(pb.authStore.token, authData.record);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your smart home</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={error && error.toLowerCase().includes('email') ? error : undefined}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && !error.toLowerCase().includes('email') && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <Button
            title="Don't have an account? Register"
            variant="ghost"
            onPress={() => router.push('/(auth)/register')}
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
    color: theme.colors.primary,
  },
  subtitle: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  loginBtn: {
    marginTop: theme.spacing.md,
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