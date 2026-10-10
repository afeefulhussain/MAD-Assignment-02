import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { BottomTabNavigator } from './navigation/BottomTabNavigator';

function MainApp() {
  const { isDark } = useAppTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <BottomTabNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
