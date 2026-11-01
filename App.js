import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from './src/theme';
import { getCourses, createCourse, updateCourse, deleteCourse } from './src/api';
import AttendanceScreen from './src/screens/AttendanceScreen';
import CrudScreen from './src/screens/CrudScreen';
import ApiScreen from './src/screens/ApiScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import CoursesScreen from './src/screens/CoursesScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('CRUD'); // 'CRUD' | 'API' | 'SWIPE' | 'HISTORY'
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load courses
  const loadCoursesData = async () => {
    try {
      const res = await getCourses();
      const courseList = res.data || [];
      setCourses(courseList);
      if (courseList.length > 0 && !activeCourse) {
        setActiveCourse(courseList[0]);
      }
    } catch (err) {
      console.warn('Failed to load courses:', err);
    }
  };

  useEffect(() => {
    loadCoursesData();
  }, []);

  const handleSelectCourse = (course) => {
    setActiveCourse(course);
    setActiveTab('SWIPE');
  };

  const handleSaveCourse = async (coursePayload, editingId) => {
    if (editingId) {
      await updateCourse(editingId, coursePayload);
    } else {
      await createCourse(coursePayload);
    }
    await loadCoursesData();
  };

  const handleDeleteCourse = async (courseId) => {
    await deleteCourse(courseId);
    if (activeCourse?._id === courseId) {
      setActiveCourse(null);
    }
    await loadCoursesData();
  };

  const statusBarPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarPadding }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bgDark}
        translucent={Platform.OS === 'android'}
      />

      {/* Top Header Navbar */}
      <View style={styles.topNavbar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconBox}>
            <Ionicons name="school" size={22} color={COLORS.primaryLight} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Student Attendance & Records</Text>
            <Text style={styles.brandSubtitle}>Assignment 02 • CRUD • Storage • Axios API</Text>
          </View>
        </View>

        {activeCourse && (
          <Pressable
            style={styles.activeCourseBadge}
            onPress={() => setActiveTab('SWIPE')}
          >
            <View style={styles.liveDot} />
            <Text style={styles.activeCourseBadgeText} numberOfLines={1}>
              {activeCourse.code || activeCourse.name}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Body View Screen Switcher */}
      <View style={styles.body}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryLight} />
            <Text style={styles.loadingText}>Loading Mobile App...</Text>
          </View>
        ) : (
          <>
            {/* TAB 1: CRUD Application (Assignment Task 1) */}
            {activeTab === 'CRUD' && <CrudScreen />}

            {/* TAB 2: Free Public API Integration with Axios (Assignment Task 2) */}
            {activeTab === 'API' && <ApiScreen />}

            {/* TAB 3: Tinder Swipe Attendance Interface */}
            {activeTab === 'SWIPE' && (
              <AttendanceScreen
                activeCourse={activeCourse}
                onNavigateToCourses={() => setActiveTab('CRUD')}
                onAttendanceSaved={() => {}}
              />
            )}

            {/* TAB 4: Attendance History & Date-wise logs */}
            {activeTab === 'HISTORY' && (
              <HistoryScreen
                courses={courses}
                activeCourse={activeCourse}
              />
            )}
          </>
        )}
      </View>

      {/* Bottom Tab Navigation Bar (Assignment 01 Requirement Preserved) */}
      <View style={styles.bottomNav}>
        {/* TAB 1: CRUD RECORDS */}
        <Pressable
          style={[styles.navItem, activeTab === 'CRUD' && styles.activeNavItem]}
          onPress={() => setActiveTab('CRUD')}
        >
          <Ionicons
            name={activeTab === 'CRUD' ? 'layers' : 'layers-outline'}
            size={20}
            color={activeTab === 'CRUD' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'CRUD' && styles.activeNavText,
            ]}
          >
            CRUD App
          </Text>
        </Pressable>

        {/* TAB 2: PUBLIC API (AXIOS) */}
        <Pressable
          style={[styles.navItem, activeTab === 'API' && styles.activeNavItem]}
          onPress={() => setActiveTab('API')}
        >
          <Feather
            name="globe"
            size={19}
            color={activeTab === 'API' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'API' && styles.activeNavText,
            ]}
          >
            Public API
          </Text>
        </Pressable>

        {/* TAB 3: ATTENDANCE SWIPE */}
        <Pressable
          style={[styles.navItem, activeTab === 'SWIPE' && styles.activeNavItem]}
          onPress={() => setActiveTab('SWIPE')}
        >
          <Ionicons
            name={activeTab === 'SWIPE' ? 'albums' : 'albums-outline'}
            size={20}
            color={activeTab === 'SWIPE' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'SWIPE' && styles.activeNavText,
            ]}
          >
            Swipe Mark
          </Text>
        </Pressable>

        {/* TAB 4: HISTORY */}
        <Pressable
          style={[styles.navItem, activeTab === 'HISTORY' && styles.activeNavItem]}
          onPress={() => setActiveTab('HISTORY')}
        >
          <Feather
            name="calendar"
            size={19}
            color={activeTab === 'HISTORY' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'HISTORY' && styles.activeNavText,
            ]}
          >
            History
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgDark,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  brandIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  activeCourseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172235',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
    marginRight: 6,
  },
  activeCourseBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#151E2E',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeNavItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
  },
  navText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  activeNavText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
});
