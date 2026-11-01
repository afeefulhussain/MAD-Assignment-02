import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { getAttendanceHistory } from '../api';
import { sendAttendanceViaWhatsApp } from '../utils/whatsapp';

export default function HistoryScreen({ courses, activeCourse }) {
  const [historyList, setHistoryList] = useState([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [detailSearch, setDetailSearch] = useState('');

  const loadHistory = async () => {
    setRefreshing(true);
    const filterId = selectedCourseFilter === 'ALL' ? null : selectedCourseFilter;
    const res = await getAttendanceHistory(filterId);
    setHistoryList(res.data || []);
    setRefreshing(false);
  };

  useEffect(() => {
    loadHistory();
  }, [selectedCourseFilter]);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 85) return COLORS.present;
    if (pct >= 70) return COLORS.warning;
    return COLORS.absent;
  };

  const handleResendWhatsApp = async (item) => {
    try {
      await sendAttendanceViaWhatsApp({
        teacherWhatsApp: item.teacherWhatsApp,
        courseName: item.courseName,
        teacherName: item.teacherName,
        date: item.date,
        records: item.records || [],
        notes: item.notes || '',
      });
    } catch (e) {
      Alert.alert('Error', 'Unable to open WhatsApp.');
    }
  };

  const filteredRecordsInModal = detailModalItem?.records?.filter((r) => {
    if (!detailSearch.trim()) return true;
    const query = detailSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(query) ||
      String(r.rollNo).toLowerCase().includes(query)
    );
  }) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance History</Text>
        <Text style={styles.headerSubtitle}>Past logs & calculated percentages</Text>
      </View>

      {/* Course Filter Horizontal Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedCourseFilter === 'ALL' && styles.activeFilterPill,
          ]}
          onPress={() => setSelectedCourseFilter('ALL')}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedCourseFilter === 'ALL' && styles.activeFilterText,
            ]}
          >
            All Courses
          </Text>
        </TouchableOpacity>

        {courses.map((course) => (
          <TouchableOpacity
            key={course._id}
            style={[
              styles.filterPill,
              selectedCourseFilter === course._id && styles.activeFilterPill,
            ]}
            onPress={() => setSelectedCourseFilter(course._id)}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCourseFilter === course._id && styles.activeFilterText,
              ]}
              numberOfLines={1}
            >
              {course.code || course.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* History Logs List */}
      <FlatList
        data={historyList}
        keyExtractor={(item) => String(item._id || item.date + item.courseId)}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadHistory}
            tintColor={COLORS.primaryLight}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={38} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Attendance Records Yet</Text>
            <Text style={styles.emptySub}>
              Swipe through students on the Swipe tab to generate your first attendance log.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const summary = item.summary || {
            total: item.records?.length || 0,
            presentCount: item.records?.filter((r) => r.status === 'PRESENT').length || 0,
            absentCount: item.records?.filter((r) => r.status === 'ABSENT').length || 0,
            percentage: 0,
          };
          const pct = summary.percentage || (summary.total > 0 ? Math.round((summary.presentCount / summary.total) * 100) : 0);
          const badgeColor = getPercentageColor(pct);

          return (
            <TouchableOpacity
              style={[styles.logCard, SHADOWS.card]}
              activeOpacity={0.8}
              onPress={() => {
                setDetailSearch('');
                setDetailModalItem(item);
              }}
            >
              {/* Date & Percentage */}
              <View style={styles.cardHeader}>
                <View style={styles.dateBlock}>
                  <Feather name="calendar" size={14} color={COLORS.primaryLight} />
                  <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>

                <View style={[styles.pctBadge, { borderColor: badgeColor }]}>
                  <Text style={[styles.pctText, { color: badgeColor }]}>
                    {pct}% PRESENT
                  </Text>
                </View>
              </View>

              {/* Course Title */}
              <Text style={styles.courseName}>{item.courseName}</Text>

              {/* Teacher Info */}
              <View style={styles.teacherRow}>
                <Text style={styles.teacherText}>
                  👨‍🏫 {item.teacherName || 'Instructor'}
                </Text>
                {item.teacherWhatsApp ? (
                  <View style={styles.waBadge}>
                    <FontAwesome5 name="whatsapp" size={12} color={COLORS.whatsapp} />
                    <Text style={styles.waText}>{item.teacherWhatsApp}</Text>
                  </View>
                ) : null}
              </View>

              {/* Progress Summary bar */}
              <View style={styles.summaryBar}>
                <View style={styles.countItem}>
                  <View style={[styles.dot, { backgroundColor: COLORS.present }]} />
                  <Text style={styles.countText}>
                    <Text style={styles.countBold}>{summary.presentCount}</Text> Present
                  </Text>
                </View>

                <View style={styles.countItem}>
                  <View style={[styles.dot, { backgroundColor: COLORS.absent }]} />
                  <Text style={styles.countText}>
                    <Text style={styles.countBold}>{summary.absentCount}</Text> Absent
                  </Text>
                </View>

                <View style={styles.countItem}>
                  <Text style={styles.totalText}>Total: {summary.total}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* DETAIL MODAL */}
      <Modal
        visible={!!detailModalItem}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {detailModalItem && (
              <>
                <View style={styles.modalTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{detailModalItem.courseName}</Text>
                    <Text style={styles.modalDate}>
                      📅 {formatDate(detailModalItem.date)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setDetailModalItem(null)}>
                    <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Search in student list */}
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={16} color={COLORS.textMuted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search roll no or name..."
                    placeholderTextColor={COLORS.textMuted}
                    value={detailSearch}
                    onChangeText={setDetailSearch}
                  />
                </View>

                {/* Records list */}
                <ScrollView style={styles.recordsList} showsVerticalScrollIndicator={false}>
                  {filteredRecordsInModal.map((rec, idx) => (
                    <View key={rec.studentId || idx} style={styles.modalRecordRow}>
                      <View style={styles.recordLeft}>
                        <View style={styles.modalRollBadge}>
                          <Text style={styles.modalRollText}>#{rec.rollNo}</Text>
                        </View>
                        <Text style={styles.modalStudentName}>{rec.name}</Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          rec.status === 'PRESENT' ? styles.presentBadge : styles.absentBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            rec.status === 'PRESENT' ? styles.presentText : styles.absentText,
                          ]}
                        >
                          {rec.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Re-send WhatsApp Button */}
                <TouchableOpacity
                  style={styles.resendWaBtn}
                  onPress={() => handleResendWhatsApp(detailModalItem)}
                >
                  <FontAwesome5 name="whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.resendWaText}>Re-send Report via WhatsApp</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    backgroundColor: COLORS.bgCardHover,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  logCard: {
    backgroundColor: '#172235',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pctText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teacherText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  waBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  waText: {
    fontSize: 11,
    color: COLORS.whatsapp,
    fontWeight: '700',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1726',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  countText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  countBold: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  totalText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#172235',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1726',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  recordsList: {
    maxHeight: 280,
    marginBottom: 14,
  },
  modalRecordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalRollBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  modalRollText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryLight,
  },
  modalStudentName: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  presentBadge: {
    backgroundColor: COLORS.presentGlow,
  },
  absentBadge: {
    backgroundColor: COLORS.absentGlow,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  presentText: {
    color: COLORS.presentText,
  },
  absentText: {
    color: COLORS.absentText,
  },
  resendWaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.whatsapp,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: COLORS.whatsapp,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  resendWaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
