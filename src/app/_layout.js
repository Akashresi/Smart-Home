import React from 'react';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Home' }} 
      />
      <Tabs.Screen 
        name="tasks" 
        options={{ title: 'Tasks' }} 
      />
      <Tabs.Screen 
        name="inventory" 
        options={{ title: 'Inventory' }} 
      />
      <Tabs.Screen 
        name="maintenance" 
        options={{ title: 'Maintenance' }} 
      />
      <Tabs.Screen 
        name="(auth)" 
        options={{ 
          href: null, 
          headerShown: false 
        }} 
      />
    </Tabs>
  );
}
