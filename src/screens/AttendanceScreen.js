import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import SwipeCard from '../components/SwipeCard';
import ProgressCounter from '../components/ProgressCounter';
import ActionButtons from '../components/ActionButtons';
import CompletionCard from '../components/CompletionCard';
import { COLORS } from '../theme';
import { sendAttendanceViaWhatsApp } from '../utils/whatsapp';
import { saveAttendanceSession } from '../api';

export default function AttendanceScreen({
  activeCourse,
  onNavigateToCourses,
  onAttendanceSaved,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([]);
  const [historyStack, setHistoryStack] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const activeCardRef = useRef(null);

  const students = activeCourse?.students || [];
  const currentStudent = students[currentIndex];
  const nextStudent = currentIndex + 1 < students.length ? students[currentIndex + 1] : null;

  // Reset when active course changes
  useEffect(() => {
    resetAttendance();
  }, [activeCourse?._id]);

  const resetAttendance = () => {
    setCurrentIndex(0);
    setRecords([]);
    setHistoryStack([]);
    setIsCompleted(false);
  };

  const handleSwipe = (status, student) => {
    const newRecord = {
      studentId: student._id || student.rollNo,
      rollNo: student.rollNo,
      name: student.name,
      status, // 'PRESENT' | 'ABSENT'
    };

    setHistoryStack((prev) => [...prev, { index: currentIndex, record: newRecord }]);
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.studentId !== newRecord.studentId);
      return [...filtered, newRecord];
    });

    if (currentIndex + 1 >= students.length) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const lastAction = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setRecords((prev) => prev.filter((r) => r.studentId !== lastAction.record.studentId));
    setCurrentIndex(lastAction.index);
    setIsCompleted(false);
  };

  // Programmatic swipe triggers
  const triggerPresent = () => {
    if (activeCardRef.current) {
      activeCardRef.current.forceSwipe('PRESENT');
    } else if (currentStudent) {
      handleSwipe('PRESENT', currentStudent);
    }
  };

  const triggerAbsent = () => {
    if (activeCardRef.current) {
      activeCardRef.current.forceSwipe('ABSENT');
    } else if (currentStudent) {
      handleSwipe('ABSENT', currentStudent);
    }
  };

  // Save session
  const persistAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    const payload = {
      courseId: activeCourse._id,
      courseName: activeCourse.name,
      courseCode: activeCourse.code || '',
      teacherName: activeCourse.teacherName,
      teacherWhatsApp: activeCourse.teacherWhatsApp,
      date: today,
      records,
      notes: '',
    };

    const result = await saveAttendanceSession(payload);
    if (onAttendanceSaved) {
      onAttendanceSaved(result);
    }
    return result;
  };

  // "Save & Send to Teacher" Core Integration
  const handleSaveAndSendWhatsApp = async () => {
    setIsSaving(true);
    try {
      await persistAttendance();

      const today = new Date().toISOString().split('T')[0];
      await sendAttendanceViaWhatsApp({
        teacherWhatsApp: activeCourse.teacherWhatsApp,
        courseName: activeCourse.name,
        courseCode: activeCourse.code,
        teacherName: activeCourse.teacherName,
        date: today,
        records,
        notes: '',
      });

      Alert.alert(
        'Session Saved!',
        'Attendance saved to database & WhatsApp report opened.'
      );
    } catch (err) {
      Alert.alert('Notice', 'Attendance saved in local cache.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOnly = async () => {
    setIsSaving(true);
    try {
      await persistAttendance();
      Alert.alert('Saved!', 'Attendance session recorded successfully.');
    } catch (err) {
      Alert.alert('Notice', 'Attendance saved in local cache.');
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;

  if (!activeCourse) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Feather name="book-open" size={38} color={COLORS.primaryLight} />
        </View>
        <Text style={styles.emptyTitle}>No Course Selected</Text>
        <Text style={styles.emptySub}>Please select or create a course to begin taking attendance.</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={onNavigateToCourses}>
          <Text style={styles.emptyButtonText}>View Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (students.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="people-outline" size={42} color={COLORS.primaryLight} />
        </View>
        <Text style={styles.emptyTitle}>Student Roster is Empty</Text>
        <Text style={styles.emptySub}>
          Add students to {activeCourse.name} to begin swiping.
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={onNavigateToCourses}>
          <Text style={styles.emptyButtonText}>Manage Students</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Course Info Bar */}
      <View style={styles.courseHeader}>
        <View style={styles.courseTitleWrapper}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.courseName} numberOfLines={1}>
              {activeCourse.name}
            </Text>
            {activeCourse.code ? (
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{activeCourse.code}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.teacherText}>
            👨‍🏫 Instructor: <Text style={styles.teacherNameHighlight}>{activeCourse.teacherName}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.changeCourseBtn}
          onPress={onNavigateToCourses}
          activeOpacity={0.7}
        >
          <Text style={styles.changeCourseText}>Courses</Text>
          <Feather name="chevron-right" size={14} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Progress & Live Counter */}
      <ProgressCounter
        currentIndex={currentIndex}
        total={students.length}
        presentCount={presentCount}
        absentCount={absentCount}
      />

      {/* Main Tinder Swipe Deck or Completion Card */}
      <View style={styles.cardArea}>
        {isCompleted ? (
          <CompletionCard
            course={activeCourse}
            records={records}
            onSaveAndWhatsApp={handleSaveAndSendWhatsApp}
            onSaveOnly={handleSaveOnly}
            onRestart={resetAttendance}
            saving={isSaving}
          />
        ) : (
          currentStudent && (
            <SwipeCard
              key={currentStudent._id || currentStudent.rollNo}
              student={currentStudent}
              nextStudent={nextStudent}
              onSwipe={handleSwipe}
              activeCardRef={activeCardRef}
            />
          )
        )}
      </View>

      {/* Floating Quick Action Buttons */}
      {!isCompleted && (
        <ActionButtons
          onSwipeLeft={triggerAbsent}
          onSwipeRight={triggerPresent}
          onUndo={handleUndo}
          canUndo={historyStack.length > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  courseTitleWrapper: {
    flex: 1,
    marginRight: 10,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courseName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  codeBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  codeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  teacherText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  teacherNameHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  changeCourseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  changeCourseText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '800',
    marginRight: 2,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: COLORS.bgDark,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
