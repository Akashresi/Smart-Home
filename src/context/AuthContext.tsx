import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { pb } from '../services/api';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'guest';
  householdId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userData = await SecureStore.getItemAsync('user');

      if (token && userData) {
        // Sync PocketBase auth store if needed
        if (!pb.authStore.isValid) {
          pb.authStore.save(token, JSON.parse(userData));
        }
        setUser(JSON.parse(userData));
      } else if (pb.authStore.isValid) {
        // If PocketBase has valid auth but SecureStore doesn't (rare)
        const user = {
          id: pb.authStore.model?.id,
          email: pb.authStore.model?.email,
          name: pb.authStore.model?.name || pb.authStore.model?.username,
          role: pb.authStore.model?.role || 'member',
          householdId: pb.authStore.model?.householdId,
        } as User;
        
        await SecureStore.setItemAsync('token', pb.authStore.token);
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (token: string, pbModel: any) => {
    const userData: User = {
      id: pbModel.id,
      email: pbModel.email,
      name: pbModel.name || pbModel.username,
      role: pbModel.role || 'member',
      householdId: pbModel.householdId,
    };

    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    pb.authStore.clear();
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
