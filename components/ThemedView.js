import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  children,
  ...otherProps
}) {
  const { colors, isDark } = useAppTheme();

  let backgroundColor = colors.background;
  let borderColor = colors.border;

  if (variant === 'card') {
    backgroundColor = colors.card;
    borderColor = colors.cardBorder;
  } else if (variant === 'surface') {
    backgroundColor = colors.surface;
  } else if (variant === 'tabBar') {
    backgroundColor = colors.tabBarBackground;
    borderColor = colors.tabBarBorder;
  }

  // Allow custom override via lightColor / darkColor
  if (isDark && darkColor) {
    backgroundColor = darkColor;
  } else if (!isDark && lightColor) {
    backgroundColor = lightColor;
  }

  const variantStyle = variant === 'card' ? styles.card : null;

  return (
    <View
      style={[
        { backgroundColor, borderColor },
        variantStyle,
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});
