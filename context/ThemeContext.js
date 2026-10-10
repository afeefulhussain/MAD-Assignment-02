import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const ThemeContext = createContext({
  themeMode: 'system',
  isDark: false,
  colors: Colors.light,
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'system' | 'light' | 'dark'

  const isDark =
    themeMode === 'system'
      ? deviceColorScheme === 'dark'
      : themeMode === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
