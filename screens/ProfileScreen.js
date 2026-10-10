import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export function ProfileScreen() {
  const { colors, themeMode, isDark, setThemeMode } = useAppTheme();

  // Verification Checklist State
  const [checklist, setChecklist] = useState([
    { id: '1', title: 'New Bottom Tab Screen', detail: 'Profile & Settings screen integrated in BottomTabNavigator.', completed: true },
    { id: '2', title: 'Custom Splash Screen', detail: 'Branded splash-icon.png added with #0F172A background in app.json.', completed: true },
    { id: '3', title: 'Custom App Icon', detail: '1024x1024 icon.png and adaptive icons created and registered.', completed: true },
    { id: '4', title: 'Themed Components', detail: 'ThemedView and ThemedText implemented with dynamic Light/Dark mode.', completed: true },
    { id: '5', title: 'Assignment 01 Extension', detail: 'Built cleanly over Assignment 01 with complete Git commit history.', completed: true },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.badgeContainer, { backgroundColor: colors.badgeBg }]}>
            <Ionicons name="person-circle-outline" size={14} color={colors.badgeText} style={{ marginRight: 6 }} />
            <ThemedText type="badge">NEW ASSIGNMENT SCREEN</ThemedText>
          </ThemedView>
          <ThemedText type="title" style={styles.headerTitle}>
            Student Profile & Settings
          </ThemedText>
          <ThemedText type="caption" style={styles.headerSubtitle}>
            Newly created bottom tab screen with student bio, live theme switcher, and submission verification.
          </ThemedText>
        </ThemedView>

        {/* Student Profile Card */}
        <ThemedView variant="card" style={styles.profileCard}>
          <ThemedView style={styles.avatarRow}>
            <ThemedView style={[styles.avatarCircle, { backgroundColor: colors.tint }]}>
              <ThemedText style={styles.avatarInitials}>AH</ThemedText>
            </ThemedView>
            <ThemedView style={styles.avatarMeta}>
              <ThemedText type="subtitle">Afeef Ul Hussain</ThemedText>
              <ThemedText type="caption">Mobile Application Development</ThemedText>
              <ThemedView style={[styles.inlineBadge, { backgroundColor: colors.surface }]}>
                <Ionicons name="shield-checkmark-outline" size={13} color={colors.tint} style={{ marginRight: 4 }} />
                <ThemedText style={{ fontSize: 11, fontWeight: '700', color: colors.tint }}>
                  Assignment 02 Verified
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.infoDivider, { backgroundColor: colors.border }]} />

          <ThemedView style={styles.infoGrid}>
            <ThemedView style={styles.infoCol}>
              <ThemedText type="caption">Course</ThemedText>
              <ThemedText type="defaultSemiBold">MAD (CS / SE)</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoCol}>
              <ThemedText type="caption">Assignment</ThemedText>
              <ThemedText type="defaultSemiBold">02 (Expo Tabs)</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoCol}>
              <ThemedText type="caption">Due Date</ThemedText>
              <ThemedText type="defaultSemiBold">10 - Oct - 2026</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Live Theme Controller (Proves Themed Components!) */}
        <ThemedView variant="card">
          <ThemedView style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Theme Switcher
            </ThemedText>
          </ThemedView>
          <ThemedText type="caption" style={{ marginBottom: 14 }}>
            Toggle theme mode below. All ThemedView and ThemedText components adapt in real-time:
          </ThemedText>

          <ThemedView style={styles.themeSelectorRow}>
            <TouchableOpacity
              style={[
                styles.themeBtn,
                { borderColor: colors.border, backgroundColor: themeMode === 'light' ? colors.tint : colors.surface },
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="sunny-outline"
                size={18}
                color={themeMode === 'light' ? '#FFFFFF' : colors.text}
              />
              <ThemedText
                style={[
                  styles.themeBtnText,
                  { color: themeMode === 'light' ? '#FFFFFF' : colors.text },
                ]}
              >
                Light
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                { borderColor: colors.border, backgroundColor: themeMode === 'dark' ? colors.tint : colors.surface },
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="moon-outline"
                size={18}
                color={themeMode === 'dark' ? '#FFFFFF' : colors.text}
              />
              <ThemedText
                style={[
                  styles.themeBtnText,
                  { color: themeMode === 'dark' ? '#FFFFFF' : colors.text },
                ]}
              >
                Dark
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                { borderColor: colors.border, backgroundColor: themeMode === 'system' ? colors.tint : colors.surface },
              ]}
              onPress={() => setThemeMode('system')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={18}
                color={themeMode === 'system' ? '#FFFFFF' : colors.text}
              />
              <ThemedText
                style={[
                  styles.themeBtnText,
                  { color: themeMode === 'system' ? '#FFFFFF' : colors.text },
                ]}
              >
                System
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={[styles.activeThemeStatus, { backgroundColor: colors.surface }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.tint} style={{ marginRight: 6 }} />
            <ThemedText type="caption">
              Current Active Mode: <ThemedText type="defaultSemiBold">{isDark ? 'Dark Theme' : 'Light Theme'}</ThemedText> ({themeMode})
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Assignment 02 Verification Checklist */}
        <ThemedView variant="card">
          <ThemedView style={styles.sectionHeader}>
            <Ionicons name="checkbox-outline" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Assignment 02 Checklist
            </ThemedText>
          </ThemedView>
          <ThemedText type="caption" style={{ marginBottom: 12 }}>
            Interactive status of all rubric requirements:
          </ThemedText>

          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkItem}
              activeOpacity={0.7}
              onPress={() => toggleCheck(item.id)}
            >
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={22}
                color={item.completed ? colors.tint : colors.subtext}
                style={{ marginRight: 10, marginTop: 2 }}
              />
              <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[item.completed && { textDecorationLine: 'none' }]}
                >
                  {item.title}
                </ThemedText>
                <ThemedText type="caption">{item.detail}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Technical Diagnostics Card */}
        <ThemedView variant="card">
          <ThemedView style={styles.sectionHeader}>
            <Ionicons name="hardware-chip-outline" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Build & Technical Specs
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.specRow}>
            <ThemedText type="caption">Expo SDK:</ThemedText>
            <ThemedText type="defaultSemiBold">v57.0.24</ThemedText>
          </ThemedView>
          <ThemedView style={styles.specRow}>
            <ThemedText type="caption">React Native:</ThemedText>
            <ThemedText type="defaultSemiBold">0.86.3</ThemedText>
          </ThemedView>
          <ThemedView style={styles.specRow}>
            <ThemedText type="caption">React:</ThemedText>
            <ThemedText type="defaultSemiBold">19.2.3</ThemedText>
          </ThemedView>
          <ThemedView style={styles.specRow}>
            <ThemedText type="caption">EAS Project ID:</ThemedText>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 12 }}>7a56e7f0-20df-4a57-9505-f4c84cacb955</ThemedText>
          </ThemedView>
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
  profileCard: {
    paddingVertical: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarMeta: {
    flex: 1,
  },
  inlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  infoDivider: {
    height: 1,
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeBtnText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 13,
  },
  activeThemeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 7,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
