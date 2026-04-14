import { Tabs, router, Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Loading } from '../components/ui/Loading';

function RootContent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <Loading message="Starting Smart Home..." overlay />;
  }

  if (isAuthenticated) {
    return (
      <Tabs screenOptions={{ headerShown: true }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
        <Tabs.Screen name="maintenance" options={{ title: 'Maintenance' }} />
        <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
        <Tabs.Screen name="household" options={{ title: 'Household' }} />
        <Tabs.Screen name="(auth)" options={{ href: null, headerShown: false }} />
      </Tabs>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
