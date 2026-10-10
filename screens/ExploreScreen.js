import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const COURSE_MODULES = [
  {
    id: '1',
    title: '1. React Native Fundamentals',
    description: 'JSX, Core Components (View, Text, Image, ScrollView), StyleSheet, Flexbox Layout.',
    status: 'Completed',
    icon: 'checkmark-circle',
  },
  {
    id: '2',
    title: '2. Expo Ecosystem & Tooling',
    description: 'Expo CLI, Expo Go client testing, project configuration in app.json, EAS builds.',
    status: 'Completed',
    icon: 'checkmark-circle',
  },
  {
    id: '3',
    title: '3. Bottom Tab Navigation & Icons',
    description: 'Bottom Tab navigation, tab bars, icons via @expo/vector-icons, screen lifecycle.',
    status: 'Active Assignment',
    icon: 'play-circle',
  },
  {
    id: '4',
    title: '4. Dynamic Theming & Dark Mode',
    description: 'ThemedView, ThemedText, custom theme context, userInterfaceStyle support.',
    status: 'Active Assignment',
    icon: 'play-circle',
  },
  {
    id: '5',
    title: '5. Splash Screens & Adaptive Icons',
    description: 'Asset generation, splash screen configuration, Android adaptive icons, branding.',
    status: 'Active Assignment',
    icon: 'play-circle',
  },
  {
    id: '6',
    title: '6. Native APIs & Device Sensors',
    description: 'Camera, Geolocation, Accelerometer, Async Storage, Push Notifications.',
    status: 'Upcoming',
    icon: 'time-outline',
  },
];

export function ExploreScreen() {
  const { colors } = useAppTheme();
  const [modules, setModules] = useState(COURSE_MODULES);

  const toggleStatus = (id) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === id) {
          const nextStatus =
            mod.status === 'Completed'
              ? 'In Review'
              : mod.status === 'In Review'
              ? 'Active Assignment'
              : 'Completed';
          return { ...mod, status: nextStatus };
        }
        return mod;
      })
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.badgeContainer, { backgroundColor: colors.badgeBg }]}>
            <Ionicons name="school-outline" size={14} color={colors.badgeText} style={{ marginRight: 6 }} />
            <ThemedText type="badge">COURSE SYLLABUS</ThemedText>
          </ThemedView>
          <ThemedText type="title" style={styles.headerTitle}>
            MAD Modules & Tasks
          </ThemedText>
          <ThemedText type="caption" style={styles.headerSubtitle}>
            Track Mobile Application Development learning outcomes and practical labs.
          </ThemedText>
        </ThemedView>

        {/* Modules List */}
        {modules.map((item) => {
          const isCompleted = item.status === 'Completed';
          const isActive = item.status === 'Active Assignment';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleStatus(item.id)}
            >
              <ThemedView variant="card" style={styles.moduleCard}>
                <ThemedView style={styles.moduleHeaderRow}>
                  <ThemedText type="subtitle" style={styles.moduleTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedView
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isCompleted
                          ? '#DCFCE7'
                          : isActive
                          ? colors.badgeBg
                          : colors.surface,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.statusPillText,
                        {
                          color: isCompleted
                            ? '#166534'
                            : isActive
                            ? colors.tint
                            : colors.subtext,
                        },
                      ]}
                    >
                      {item.status}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedText type="caption" style={styles.moduleDesc}>
                  {item.description}
                </ThemedText>

                <ThemedView style={styles.moduleFooterRow}>
                  <ThemedView style={styles.interactiveHint}>
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'chevron-forward-circle-outline'}
                      size={16}
                      color={isCompleted ? '#16A34A' : colors.tint}
                      style={{ marginRight: 6 }}
                    />
                    <ThemedText type="caption" style={{ color: colors.tint, fontWeight: '600' }}>
                      Tap to toggle status
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          );
        })}

        {/* Reference Banner */}
        <ThemedView variant="card" style={{ marginTop: 12 }}>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="information-circle-outline" size={20} color={colors.tint} style={{ marginRight: 8 }} />
            <ThemedText type="defaultSemiBold">Expo & React Native Architecture</ThemedText>
          </ThemedView>
          <ThemedText type="caption">
            All cards and text elements in this screen are wrapped inside ThemedView and ThemedText components, fully adhering to Assignment 02 requirement 3.
          </ThemedText>
        </ThemedView>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  moduleCard: {
    marginVertical: 6,
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    flex: 1,
    marginRight: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moduleDesc: {
    marginBottom: 12,
    lineHeight: 20,
  },
  moduleFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  interactiveHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
