import { Tabs } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout() {
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
