import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export function HomeScreen({ navigation, onNavigateTab }) {
  const [count, setCount] = useState(0);
  const { colors, isDark } = useAppTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.badgeContainer, { backgroundColor: colors.badgeBg }]}>
            <Ionicons name="sparkles" size={14} color={colors.badgeText} style={{ marginRight: 6 }} />
            <ThemedText type="badge">MAD ASSIGNMENT 02</ThemedText>
          </ThemedView>
          <ThemedText type="title" style={styles.headerTitle}>
            Mobile App Development
          </ThemedText>
          <ThemedText type="caption" style={styles.headerSubtitle}>
            Extended React Native Expo Application with Bottom Tab Bar, Theming, and Custom Assets.
          </ThemedText>
        </ThemedView>

        {/* Feature Highlights Card */}
        <ThemedView variant="card">
          <ThemedView style={styles.cardHeaderRow}>
            <Ionicons name="layers-outline" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.cardHeaderTitle}>
              Assignment 02 Upgrades
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.featureRow}>
            <ThemedView style={[styles.featureIconBadge, { backgroundColor: colors.surface }]}>
              <Ionicons name="browsers-outline" size={18} color={colors.tint} />
            </ThemedView>
            <ThemedView style={styles.featureInfo}>
              <ThemedText type="defaultSemiBold">Bottom Tab Bar Navigation</ThemedText>
              <ThemedText type="caption">Seamless multi-screen tab interface added.</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.featureRow}>
            <ThemedView style={[styles.featureIconBadge, { backgroundColor: colors.surface }]}>
              <Ionicons name="color-palette-outline" size={18} color={colors.tint} />
            </ThemedView>
            <ThemedView style={styles.featureInfo}>
              <ThemedText type="defaultSemiBold">ThemedView & ThemedText</ThemedText>
              <ThemedText type="caption">Full light & dark mode component architecture.</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.featureRow}>
            <ThemedView style={[styles.featureIconBadge, { backgroundColor: colors.surface }]}>
              <Ionicons name="image-outline" size={18} color={colors.tint} />
            </ThemedView>
            <ThemedView style={styles.featureInfo}>
              <ThemedText type="defaultSemiBold">Custom Splash & App Icon</ThemedText>
              <ThemedText type="caption">Branded assets configured in app.json.</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Interactive State Demo Card (Preserved & Extended from Assignment 01) */}
        <ThemedView variant="card">
          <ThemedView style={styles.cardHeaderRow}>
            <Ionicons name="flash-outline" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.cardHeaderTitle}>
              Interactive State Counter
            </ThemedText>
          </ThemedView>

          <ThemedText type="caption" style={{ marginBottom: 12 }}>
            Demonstrating React state management inside ThemedView container:
          </ThemedText>

          <ThemedView style={[styles.counterBox, { backgroundColor: colors.surface }]}>
            <ThemedText style={[styles.counterNumber, { color: colors.tint }]}>
              {count}
            </ThemedText>
            <ThemedText type="caption">Taps Registered</ThemedText>
          </ThemedView>

          <ThemedView style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primaryBtn }]}
              onPress={() => setCount(count + 1)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <ThemedText style={{ color: colors.primaryBtnText, fontWeight: '700' }}>
                Tap to Increment
              </ThemedText>
            </TouchableOpacity>

            {count > 0 && (
              <TouchableOpacity
                style={[styles.btn, styles.resetBtn, { backgroundColor: colors.dangerBtn }]}
                onPress={() => setCount(0)}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-outline" size={18} color={colors.dangerBtnText} style={{ marginRight: 4 }} />
                <ThemedText style={{ color: colors.dangerBtnText, fontWeight: '700' }}>
                  Reset
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>

        {/* Quick Action Navigation */}
        <ThemedView variant="card">
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
            Explore Assignment Screens
          </ThemedText>
          <ThemedText type="caption" style={{ marginBottom: 16 }}>
            Use the bottom tab bar below or tap shortcuts to inspect the newly added screens:
          </ThemedText>

          <ThemedView style={styles.navShortcuts}>
            <TouchableOpacity
              style={[styles.shortcutBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => onNavigateTab && onNavigateTab('explore')}
            >
              <Ionicons name="book-outline" size={20} color={colors.tint} />
              <ThemedText type="defaultSemiBold" style={{ marginTop: 4 }}>Course Syllabus</ThemedText>
              <ThemedText type="caption">Tab 2: MAD Topics</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shortcutBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => onNavigateTab && onNavigateTab('profile')}
            >
              <Ionicons name="person-outline" size={20} color={colors.tint} />
              <ThemedText type="defaultSemiBold" style={{ marginTop: 4 }}>New Profile Tab</ThemedText>
              <ThemedText type="caption">Tab 3: Student & Theme</ThemedText>
            </TouchableOpacity>
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    marginLeft: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  counterBox: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginVertical: 10,
  },
  counterNumber: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  resetBtn: {
    flex: 0.6,
  },
  navShortcuts: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
