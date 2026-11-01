import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

export default function CompletionCard({
  course,
  records,
  onSaveAndWhatsApp,
  onSaveOnly,
  onRestart,
  saving = false,
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PRESENT, ABSENT

  const total = records.length;
  const presentStudents = records.filter((r) => r.status === 'PRESENT');
  const absentStudents = records.filter((r) => r.status === 'ABSENT');
  const percentage = total > 0 ? Math.round((presentStudents.length / total) * 100) : 0;

  const filteredRecords =
    activeTab === 'PRESENT'
      ? presentStudents
      : activeTab === 'ABSENT'
      ? absentStudents
      : records;

  return (
    <View style={[styles.card, SHADOWS.card]}>
      {/* Top Completion Header */}
      <View style={styles.topHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={28} color={COLORS.present} />
        </View>
        <Text style={styles.title}>Attendance Completed!</Text>
        <Text style={styles.subtitle}>{course.name}</Text>
      </View>

      {/* KPI Metrics Grid */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statValue}>{total}</Text>
        </View>

        <View style={[styles.statBox, { borderColor: COLORS.presentGlow }]}>
          <Text style={[styles.statLabel, { color: COLORS.presentText }]}>PRESENT</Text>
          <Text style={[styles.statValue, { color: COLORS.present }]}>{presentStudents.length}</Text>
        </View>

        <View style={[styles.statBox, { borderColor: COLORS.absentGlow }]}>
          <Text style={[styles.statLabel, { color: COLORS.absentText }]}>ABSENT</Text>
          <Text style={[styles.statValue, { color: COLORS.absent }]}>{absentStudents.length}</Text>
        </View>

        <View style={[styles.statBox, { borderColor: COLORS.primaryGlow }]}>
          <Text style={[styles.statLabel, { color: COLORS.primaryLight }]}>RATE</Text>
          <Text style={[styles.statValue, { color: COLORS.primaryLight }]}>{percentage}%</Text>
        </View>
      </View>

      {/* Teacher Contact Info Pill */}
      <View style={styles.teacherInfoPill}>
        <Ionicons name="person-circle" size={18} color={COLORS.primaryLight} />
        <Text style={styles.teacherInfoText}>
          Recipient: <Text style={styles.boldText}>{course.teacherName}</Text>
        </Text>
        <Text style={styles.teacherPhone}>({course.teacherWhatsApp})</Text>
      </View>

      {/* Segmented Filter Pills */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ALL' && styles.activeTab]}
          onPress={() => setActiveTab('ALL')}
        >
          <Text style={[styles.tabText, activeTab === 'ALL' && styles.activeTabText]}>
            All ({total})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'PRESENT' && styles.activeTabPresent]}
          onPress={() => setActiveTab('PRESENT')}
        >
          <Text style={[styles.tabText, activeTab === 'PRESENT' && styles.activeTabTextPresent]}>
            Present ({presentStudents.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'ABSENT' && styles.activeTabAbsent]}
          onPress={() => setActiveTab('ABSENT')}
        >
          <Text style={[styles.tabText, activeTab === 'ABSENT' && styles.activeTabTextAbsent]}>
            Absent ({absentStudents.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Student List Preview */}
      <ScrollView style={styles.listPreview} showsVerticalScrollIndicator={false}>
        {filteredRecords.map((item) => (
          <View key={item.studentId} style={styles.recordRow}>
            <View style={styles.recordLeft}>
              <View style={styles.miniRoll}>
                <Text style={styles.miniRollText}>#{item.rollNo}</Text>
              </View>
              <Text style={styles.recordName}>{item.name}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === 'PRESENT' ? styles.presentBadge : styles.absentBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  item.status === 'PRESENT' ? styles.presentBadgeText : styles.absentBadgeText,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Primary Actions */}
      <View style={styles.actionsContainer}>
        {/* Core Direct WhatsApp Action */}
        <TouchableOpacity
          style={[styles.whatsAppButton, saving && { opacity: 0.75 }]}
          onPress={onSaveAndWhatsApp}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <FontAwesome name="whatsapp" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.whatsAppButtonText}>Save & Send to Teacher</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Secondary Actions */}
        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={styles.saveOnlyButton}
            onPress={onSaveOnly}
            disabled={saving}
          >
            <MaterialIcons name="cloud-done" size={18} color={COLORS.textSecondary} />
            <Text style={styles.saveOnlyText}>Save Only</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restartButton}
            onPress={onRestart}
            disabled={saving}
          >
            <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
            <Text style={styles.restartText}>Re-swipe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#172235',
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 20,
    maxHeight: '94%',
  },
  topHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.presentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.present,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0F1726',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  teacherInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  teacherInfoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  boldText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  teacherPhone: {
    fontSize: 12,
    color: COLORS.whatsapp,
    fontWeight: '700',
    marginLeft: 6,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#0F1726',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: COLORS.bgCardHover,
  },
  activeTabPresent: {
    backgroundColor: COLORS.presentGlow,
  },
  activeTabAbsent: {
    backgroundColor: COLORS.absentGlow,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  activeTabTextPresent: {
    color: COLORS.presentText,
  },
  activeTabTextAbsent: {
    color: COLORS.absentText,
  },
  listPreview: {
    maxHeight: 140,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#0F1726',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniRoll: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  miniRollText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  recordName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
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
  presentBadgeText: {
    color: COLORS.presentText,
  },
  absentBadgeText: {
    color: COLORS.absentText,
  },
  actionsContainer: {
    gap: 10,
  },
  whatsAppButton: {
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
  whatsAppButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveOnlyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1726',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  saveOnlyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1726',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  restartText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
