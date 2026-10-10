import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export function BottomTabNavigator() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'profile'
  const { colors, isDark } = useAppTheme();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      iconActive: 'home',
      iconInactive: 'home-outline',
      badge: null,
    },
    {
      id: 'explore',
      label: 'Modules',
      iconActive: 'book',
      iconInactive: 'book-outline',
      badge: null,
    },
    {
      id: 'profile',
      label: 'Profile',
      iconActive: 'person',
      iconInactive: 'person-outline',
      badge: 'NEW',
    },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'home':
      default:
        return <HomeScreen onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Screen Body */}
      <ThemedView style={styles.screenContainer}>
        {renderActiveScreen()}
      </ThemedView>

      {/* Bottom Tab Bar Container using ThemedView */}
      <ThemedView
        variant="tabBar"
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.tabBarBorder,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const iconColor = isSelected ? colors.tabIconSelected : colors.tabIconDefault;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              {/* Tab Icon with optional badge */}
              <ThemedView style={styles.iconWrapper}>
                <Ionicons
                  name={isSelected ? tab.iconActive : tab.iconInactive}
                  size={24}
                  color={iconColor}
                />
                {tab.badge && (
                  <ThemedView
                    style={[
                      styles.tabBadge,
                      {
                        backgroundColor: isSelected ? colors.tint : '#EF4444',
                      },
                    ]}
                  >
                    <ThemedText style={styles.tabBadgeText}>{tab.badge}</ThemedText>
                  </ThemedView>
                )}
              </ThemedView>

              {/* Tab Title using ThemedText */}
              <ThemedText
                style={[
                  styles.tabLabel,
                  {
                    color: isSelected ? colors.tabIconSelected : colors.tabIconDefault,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </ThemedText>

              {/* Active Tab Underline Pill */}
              {isSelected && (
                <ThemedView
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.tint },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 6,
    paddingTop: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeIndicator: {
    width: 16,
    height: 3,
    borderRadius: 2,
    marginTop: 3,
  },
});
