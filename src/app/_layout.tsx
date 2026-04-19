import { Tabs, router, Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Loading } from '../components/ui/Loading';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

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
      <Tabs 
        screenOptions={{ 
          headerShown: true,
          tabBarActiveTintColor: theme.colors.success,
          tabBarInactiveTintColor: theme.colors.neutral[400],
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          }
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="tasks" 
          options={{ 
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="inventory" 
          options={{ 
            title: 'Inventory',
            tabBarIcon: ({ color, size }) => <Ionicons name="cube" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="maintenance" 
          options={{ 
            title: 'Maintenance',
            tabBarIcon: ({ color, size }) => <Ionicons name="construct" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="alerts" 
          options={{ 
            title: 'Alerts',
            tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
          }} 
        />
        <Tabs.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          }} 
        />
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
