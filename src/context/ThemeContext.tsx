import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext({ isDark: false });
export const ThemeProvider = ({ children }: any) => {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');
  useEffect(() => setIsDark(scheme === 'dark'), [scheme]);
  return <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
