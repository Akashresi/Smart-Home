import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors } from '../theme/colors';

// Define dark colors based on light colors with appropriate adjustments
export const darkColors = {
  ...lightColors,
  white: '#1A1A1A',
  black: '#FFFFFF',
  background: '#0F172A',
  surface: '#1E293B',
  neutral: {
    50: '#1E293B',
    100: '#334155',
    200: '#475569',
    300: '#64748B',
    400: '#94A3B8',
    500: '#CBD5E1',
    600: '#E2E8F0',
    700: '#F1F5F9',
    800: '#F8FAFC',
    900: '#FFFFFF',
  },
  glass: {
    light: 'rgba(30, 41, 59, 0.8)',
    medium: 'rgba(30, 41, 59, 0.5)',
    dark: 'rgba(0, 0, 0, 0.6)',
  }
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode) {
        setModeState(savedMode as ThemeMode);
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      if (newMode === 'system') {
        await AsyncStorage.removeItem('themeMode');
      } else {
        await AsyncStorage.setItem('themeMode', newMode);
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
