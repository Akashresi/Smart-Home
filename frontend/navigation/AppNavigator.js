import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TaskAndCleaning from '../screens/TaskAndCleaning';
import InventoryExpense from '../screens/InventoryExpense';
import MaintenanceScreen from '../screens/MaintenanceScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks & Cleaning" component={TaskAndCleaning} />
      <Tab.Screen name="Inventory & Expense" component={InventoryExpense} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
    </Tab.Navigator>
  );
}
