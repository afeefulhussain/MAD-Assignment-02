import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

const STORAGE_KEY = '@crud_students_records_v1';

const INITIAL_RECORDS = [
  {
    id: 'rec_1',
    rollNo: '01',
    name: 'Ali Ahmed',
    department: 'Computer Science',
    email: 'ali.ahmed@campus.edu',
    phone: '+923001234567',
    status: 'Active',
  },
  {
    id: 'rec_2',
    rollNo: '02',
    name: 'Fatima Zahra',
    department: 'Software Engineering',
    email: 'fatima.z@campus.edu',
    phone: '+923007654321',
    status: 'Active',
  },
  {
    id: 'rec_3',
    rollNo: '03',
    name: 'Muhammad Bilal',
    department: 'Data Science',
    email: 'bilal.m@campus.edu',
    phone: '+923019876543',
    status: 'Active',
  },
  {
    id: 'rec_4',
    rollNo: '04',
    name: 'Ayesha Noor',
    department: 'Artificial Intelligence',
    email: 'ayesha.noor@campus.edu',
    phone: '+923024567890',
    status: 'Inactive',
  },
  {
    id: 'rec_5',
    rollNo: '05',
    name: 'Hamza Tariq',
    department: 'Computer Science',
    email: 'hamza.t@campus.edu',
    phone: '+923035678901',
    status: 'Active',
  },
  {
    id: 'rec_6',
    rollNo: '06',
    name: 'Zainab Bibi',
    department: 'Software Engineering',
    email: 'zainab.b@campus.edu',
    phone: '+923046789012',
    status: 'Active',
  },
];

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
];

export default function CrudScreen() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');

  // Load records from AsyncStorage on mount (Local Storage Requirement)
  useEffect(() => {
    loadLocalRecords();
  }, []);

  const loadLocalRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setRecords(JSON.parse(stored));
      } else {
        // Initialize default records for first time
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
        setRecords(INITIAL_RECORDS);
      }
    } catch (error) {
      console.error('Error loading records from AsyncStorage:', error);
      setRecords(INITIAL_RECORDS);
    }
  };

  // Save records to AsyncStorage (Local Storage Persistence)
  const persistRecords = async (updatedList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setRecords(updatedList);
    } catch (error) {
      Alert.alert('Storage Error', 'Failed to save record to local storage.');
    }
  };

  // CREATE / UPDATE Record
  const handleSaveRecord = () => {
    // Validation using JavaScript array method: some()
    if (!name.trim() || !rollNo.trim() || !department.trim()) {
      Alert.alert('Required Fields', 'Please fill in Name, Roll Number, and Department.');
      return;
    }

    // Check duplicate roll number using Array.some()
    const isDuplicate = records.some(
      (r) =>
        r.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase() &&
        r.id !== editingId
    );

    if (isDuplicate) {
      Alert.alert('Duplicate Roll Number', `Student with Roll #${rollNo.trim()} already exists!`);
      return;
    }

    if (editingId) {
      // UPDATE Operation using Array.map() and Array.find()
      const existing = records.find((r) => r.id === editingId);
      if (existing) {
        const updatedList = records.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                rollNo: rollNo.trim(),
                department: department.trim(),
                email: email.trim(),
                phone: phone.trim(),
                status,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        persistRecords(updatedList);
        Alert.alert('Success', 'Record updated successfully!');
      }
    } else {
      // CREATE Operation
      const newRecord = {
        id: 'rec_' + Date.now(),
        rollNo: rollNo.trim(),
        name: name.trim(),
        department: department.trim(),
        email: email.trim() || `${rollNo.trim().toLowerCase()}@campus.edu`,
        phone: phone.trim() || '+923000000000',
        status,
        createdAt: new Date().toISOString(),
      };
      const updatedList = [newRecord, ...records];
      persistRecords(updatedList);
      Alert.alert('Success', 'New student record added successfully!');
    }

    closeFormModal();
  };

  // DELETE Record using Array.filter()
  const handleDeleteRecord = (id) => {
    // Find record details using Array.find()
    const target = records.find((r) => r.id === id);
    if (!target) return;

    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete ${target.name} (Roll #${target.rollNo})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = records.filter((r) => r.id !== id);
            persistRecords(updated);
          },
        },
      ]
    );
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setRollNo(item.rollNo);
    setDepartment(item.department);
    setEmail(item.email || '');
    setPhone(item.phone || '');
    setStatus(item.status || 'Active');
    setModalVisible(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setRollNo(String(records.length + 1).padStart(2, '0'));
    setDepartment('Computer Science');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalVisible(false);
    setEditingId(null);
  };

  // Open Details Modal using Array.find()
  const openDetailsModal = (id) => {
    const item = records.find((r) => r.id === id);
    if (item) {
      setSelectedRecord(item);
      setDetailsModalVisible(true);
    }
  };

  // SEARCH & FILTER using JavaScript Array Methods: filter(), some(), map()
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Search matching across name, rollNo, email, department
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.rollNo.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        (item.email && item.email.toLowerCase().includes(query));

      // Department filter
      const matchesDept =
        selectedDept === 'All' || item.department === selectedDept;

      // Status filter
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [records, searchQuery, selectedDept, statusFilter]);

  // Demonstration of Array.every() method (Validation / Summary check)
  const allActive = useMemo(() => {
    return records.length > 0 && records.every((r) => r.status === 'Active');
  }, [records]);

  // Demonstration of Array.some() method (Inactive check)
  const hasInactive = useMemo(() => {
    return records.some((r) => r.status === 'Inactive');
  }, [records]);

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Student Records (CRUD)</Text>
          <Text style={styles.headerSubtitle}>
            Local Storage (AsyncStorage) & Array Methods
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.btnPressed]}
          onPress={openCreateModal}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Student</Text>
        </Pressable>
      </View>

      {/* Summary KPI Strip using map() */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>TOTAL</Text>
          <Text style={styles.kpiValue}>{records.length}</Text>
        </View>
        <View style={[styles.kpiCard, { borderColor: COLORS.presentGlow }]}>
          <Text style={[styles.kpiLabel, { color: COLORS.presentText }]}>ACTIVE</Text>
          <Text style={[styles.kpiValue, { color: COLORS.present }]}>
            {records.filter((r) => r.status === 'Active').length}
          </Text>
        </View>
        <View style={[styles.kpiCard, { borderColor: COLORS.absentGlow }]}>
          <Text style={[styles.kpiLabel, { color: COLORS.absentText }]}>INACTIVE</Text>
          <Text style={[styles.kpiValue, { color: COLORS.absent }]}>
            {records.filter((r) => r.status === 'Inactive').length}
          </Text>
        </View>
        <View style={[styles.kpiCard, { borderColor: COLORS.primaryGlow }]}>
          <Text style={[styles.kpiLabel, { color: COLORS.primaryLight }]}>SHOWING</Text>
          <Text style={[styles.kpiValue, { color: COLORS.primaryLight }]}>
            {filteredRecords.length}
          </Text>
        </View>
      </View>

      {/* Search Bar using TextInput */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, roll no, department..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Department Filter Pills (using Array.map) */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <Pressable
                key={dept}
                style={[styles.filterPill, isSelected && styles.activeFilterPill]}
                onPress={() => setSelectedDept(dept)}
              >
                <Text style={[styles.filterPillText, isSelected && styles.activeFilterPillText]}>
                  {dept}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* FlatList Component for displaying records dynamically */}
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="folder" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query or department filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isActive = item.status === 'Active';
          return (
            <Pressable
              style={({ pressed }) => [
                styles.recordCard,
                SHADOWS.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => openDetailsModal(item.id)}
            >
              {/* Card Header */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.rollBadge}>
                  <Text style={styles.rollBadgeText}>#{item.rollNo}</Text>
                </View>

                <View style={styles.cardTitleBlock}>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.deptText}>{item.department}</Text>
                </View>

                {/* Status Indicator */}
                <View
                  style={[
                    styles.statusChip,
                    isActive ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isActive ? COLORS.present : COLORS.absent },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusChipText,
                      { color: isActive ? COLORS.present : COLORS.absent },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.contactRow}>
                <View style={styles.contactItem}>
                  <Feather name="mail" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.contactText} numberOfLines={1}>
                    {item.email}
                  </Text>
                </View>

                <View style={styles.contactItem}>
                  <Feather name="phone" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.contactText}>{item.phone}</Text>
                </View>
              </View>

              {/* Action Buttons: Edit & Delete (using Pressable) */}
              <View style={styles.cardActionsRow}>
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, styles.editBtn, pressed && styles.btnPressed]}
                  onPress={() => openEditModal(item)}
                >
                  <Feather name="edit-2" size={14} color={COLORS.primaryLight} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && styles.btnPressed]}
                  onPress={() => handleDeleteRecord(item.id)}
                >
                  <Feather name="trash-2" size={14} color={COLORS.absent} />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />

      {/* CREATE / UPDATE MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFormModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Student Record' : 'Add New Student'}
              </Text>
              <Pressable onPress={closeFormModal}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Roll Number Input */}
              <Text style={styles.fieldLabel}>Roll Number *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. 07"
                placeholderTextColor={COLORS.textMuted}
                value={rollNo}
                onChangeText={setRollNo}
              />

              {/* Full Name Input */}
              <Text style={styles.fieldLabel}>Student Full Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Daniyal Aslam"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
              />

              {/* Department Picker */}
              <Text style={styles.fieldLabel}>Department / Program *</Text>
              <View style={styles.deptOptionsGrid}>
                {DEPARTMENTS.filter((d) => d !== 'All').map((dept) => {
                  const selected = department === dept;
                  return (
                    <Pressable
                      key={dept}
                      style={[styles.deptOption, selected && styles.deptOptionSelected]}
                      onPress={() => setDepartment(dept)}
                    >
                      <Text style={[styles.deptOptionText, selected && styles.deptOptionTextSelected]}>
                        {dept}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Email Address */}
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. student@campus.edu"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Phone / WhatsApp */}
              <Text style={styles.fieldLabel}>Phone / WhatsApp Number</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. +923001234567"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              {/* Status Picker (Active / Inactive) */}
              <Text style={styles.fieldLabel}>Enrollment Status</Text>
              <View style={styles.statusToggleRow}>
                <Pressable
                  style={[
                    styles.statusToggleBtn,
                    status === 'Active' && styles.statusToggleBtnActive,
                  ]}
                  onPress={() => setStatus('Active')}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'Active' && { color: COLORS.present, fontWeight: '800' },
                    ]}
                  >
                    Active
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusToggleBtn,
                    status === 'Inactive' && styles.statusToggleBtnInactive,
                  ]}
                  onPress={() => setStatus('Inactive')}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'Inactive' && { color: COLORS.absent, fontWeight: '800' },
                    ]}
                  >
                    Inactive
                  </Text>
                </Pressable>
              </View>

              {/* Save Button (Pressable) */}
              <Pressable
                style={({ pressed }) => [styles.submitBtn, pressed && styles.btnPressed]}
                onPress={handleSaveRecord}
              >
                <Text style={styles.submitBtnText}>
                  {editingId ? 'Update Record' : 'Save Student Record'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* DETAILS VIEW MODAL */}
      <Modal
        visible={detailsModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsCard}>
            {selectedRecord && (
              <>
                <View style={styles.detailsHeader}>
                  <View style={styles.detailsAvatar}>
                    <Text style={styles.detailsAvatarText}>
                      {selectedRecord.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.detailsName}>{selectedRecord.name}</Text>
                  <Text style={styles.detailsRoll}>Roll #{selectedRecord.rollNo}</Text>
                </View>

                <View style={styles.detailsInfoBox}>
                  <View style={styles.detailsInfoRow}>
                    <Text style={styles.detailsLabel}>Department:</Text>
                    <Text style={styles.detailsValue}>{selectedRecord.department}</Text>
                  </View>

                  <View style={styles.detailsInfoRow}>
                    <Text style={styles.detailsLabel}>Email:</Text>
                    <Text style={styles.detailsValue}>{selectedRecord.email}</Text>
                  </View>

                  <View style={styles.detailsInfoRow}>
                    <Text style={styles.detailsLabel}>Phone:</Text>
                    <Text style={styles.detailsValue}>{selectedRecord.phone}</Text>
                  </View>

                  <View style={styles.detailsInfoRow}>
                    <Text style={styles.detailsLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.detailsValue,
                        { color: selectedRecord.status === 'Active' ? COLORS.present : COLORS.absent },
                      ]}
                    >
                      {selectedRecord.status}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.closeDetailsBtn}
                  onPress={() => setDetailsModalVisible(false)}
                >
                  <Text style={styles.closeDetailsBtnText}>Close</Text>
                </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  btnPressed: {
    opacity: 0.75,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#172235',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    marginHorizontal: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  filterWrapper: {
    marginBottom: 10,
  },
  filterBar: {
    paddingHorizontal: 18,
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#172235',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  filterPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  activeFilterPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#172235',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rollBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    marginRight: 10,
  },
  rollBadgeText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deptText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 5,
  },
  statusActive: {
    backgroundColor: COLORS.presentGlow,
  },
  statusInactive: {
    backgroundColor: COLORS.absentGlow,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  contactRow: {
    backgroundColor: '#0F1726',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  editBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  editBtnText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  deleteBtnText: {
    color: COLORS.absent,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#172235',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: '#0F1726',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  deptOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  deptOption: {
    backgroundColor: '#0F1726',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deptOptionSelected: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: COLORS.primaryLight,
  },
  deptOptionText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  deptOptionTextSelected: {
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statusToggleBtn: {
    flex: 1,
    backgroundColor: '#0F1726',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusToggleBtnActive: {
    backgroundColor: COLORS.presentGlow,
    borderColor: COLORS.present,
  },
  statusToggleBtnInactive: {
    backgroundColor: COLORS.absentGlow,
    borderColor: COLORS.absent,
  },
  statusToggleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  detailsCard: {
    backgroundColor: '#172235',
    marginHorizontal: 24,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignSelf: 'center',
    width: '90%',
  },
  detailsHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  detailsAvatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailsName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailsRoll: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsInfoBox: {
    backgroundColor: '#0F1726',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  detailsValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeDetailsBtn: {
    backgroundColor: COLORS.bgCardHover,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeDetailsBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
