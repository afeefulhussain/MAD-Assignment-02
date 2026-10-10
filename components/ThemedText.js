import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  children,
  ...otherProps
}) {
  const { colors, isDark } = useAppTheme();

  let textColor = colors.text;

  if (type === 'caption') {
    textColor = colors.subtext;
  } else if (type === 'link') {
    textColor = colors.tint;
  } else if (type === 'badge') {
    textColor = colors.badgeText;
  }

  if (isDark && darkColor) {
    textColor = darkColor;
  } else if (!isDark && lightColor) {
    textColor = lightColor;
  }

  let typeStyle = styles.default;
  switch (type) {
    case 'title':
      typeStyle = styles.title;
      break;
    case 'subtitle':
      typeStyle = styles.subtitle;
      break;
    case 'defaultSemiBold':
      typeStyle = styles.defaultSemiBold;
      break;
    case 'caption':
      typeStyle = styles.caption;
      break;
    case 'badge':
      typeStyle = styles.badge;
      break;
    case 'code':
      typeStyle = styles.code;
      break;
    case 'link':
      typeStyle = styles.link;
      break;
  }

  return (
    <Text
      style={[
        { color: textColor },
        typeStyle,
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 15,
    lineHeight: 22,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
});
