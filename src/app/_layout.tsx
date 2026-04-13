import { Tabs, router } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import { pb } from '../services/api';

export default function Layout() {
  const [isLogged, setIsLogged] = useState(pb.authStore.isValid);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('token').then(token => {
      if (token) {
        pb.authStore.save(token, null);
        setIsLogged(true);
      } else {
        setIsLogged(pb.authStore.isValid);
      }
      setIsChecking(false);
    });

    return pb.authStore.onChange((token, model) => {
      const valid = pb.authStore.isValid;
      setIsLogged(valid);
      if (!valid) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/');
      }
    });
  }, []);

  useEffect(() => {
    if (!isChecking && !isLogged) {
      router.replace('/(auth)/login');
    }
  }, [isLogged, isChecking]);

  if (isChecking) return null;

  return (
    <ThemeProvider>
      <Tabs screenOptions={{ headerShown: true }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
        <Tabs.Screen name="maintenance" options={{ title: 'Maintenance' }} />
        <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
        <Tabs.Screen name="household" options={{ title: 'Household' }} />
        <Tabs.Screen name="(auth)" options={{ href: null, headerShown: false }} />
      </Tabs>
    </ThemeProvider>
  );
}
