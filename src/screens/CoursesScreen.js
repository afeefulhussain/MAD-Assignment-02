import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

export default function CoursesScreen({
  courses,
  activeCourse,
  onSelectCourse,
  onSaveCourse,
  onDeleteCourse,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherWhatsApp, setTeacherWhatsApp] = useState('');
  const [students, setStudents] = useState([]);

  // Student inputs inside modal
  const [rollInput, setRollInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const openAddModal = () => {
    setEditingCourseId(null);
    setName('');
    setCode('');
    setTeacherName('');
    setTeacherWhatsApp('+92');
    setStudents([]);
    setModalVisible(true);
  };

  const openEditModal = (course) => {
    setEditingCourseId(course._id);
    setName(course.name);
    setCode(course.code || '');
    setTeacherName(course.teacherName);
    setTeacherWhatsApp(course.teacherWhatsApp);
    setStudents(course.students ? [...course.students] : []);
    setModalVisible(true);
  };

  const handleAddStudent = () => {
    if (!nameInput.trim()) {
      Alert.alert('Validation', 'Please enter student name');
      return;
    }
    const rollNo = rollInput.trim() || String(students.length + 1).padStart(2, '0');
    const newStudent = {
      _id: 'temp_' + Date.now() + Math.random(),
      rollNo,
      name: nameInput.trim(),
    };
    setStudents([...students, newStudent]);
    setRollInput('');
    setNameInput('');
  };

  const handleRemoveStudent = (id) => {
    setStudents(students.filter((s) => s._id !== id && s.rollNo !== id));
  };

  // 1-Tap Sample Roster Generator
  const generateSampleStudents = () => {
    const samples = [
      { _id: 's1', rollNo: '01', name: 'Ali Ahmed' },
      { _id: 's2', rollNo: '02', name: 'Fatima Zahra' },
      { _id: 's3', rollNo: '03', name: 'Muhammad Bilal' },
      { _id: 's4', rollNo: '04', name: 'Ayesha Noor' },
      { _id: 's5', rollNo: '05', name: 'Hamza Tariq' },
      { _id: 's6', rollNo: '06', name: 'Zainab Bibi' },
      { _id: 's7', rollNo: '07', name: 'Usman Ghani' },
      { _id: 's8', rollNo: '08', name: 'Sara Khan' },
      { _id: 's9', rollNo: '09', name: 'Zayan Malik' },
      { _id: 's10', rollNo: '10', name: 'Haniya Imran' },
    ];
    setStudents(samples);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n');
    const imported = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const match = trimmed.match(/^(\d+)[\s,-]+(.*)$/);
      if (match) {
        imported.push({
          _id: 'b_' + Date.now() + index,
          rollNo: match[1],
          name: match[2].trim(),
        });
      } else {
        imported.push({
          _id: 'b_' + Date.now() + index,
          rollNo: String(students.length + imported.length + 1).padStart(2, '0'),
          name: trimmed,
        });
      }
    });

    setStudents([...students, ...imported]);
    setBulkText('');
    setBulkModalVisible(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter Course/Subject Name');
      return;
    }
    if (!teacherName.trim()) {
      Alert.alert('Required', 'Please enter Teacher Name');
      return;
    }
    if (!teacherWhatsApp.trim() || teacherWhatsApp.trim().length < 6) {
      Alert.alert('Required', 'Please enter valid Teacher WhatsApp number with country code (e.g. +923001234567)');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim(),
      teacherName: teacherName.trim(),
      teacherWhatsApp: teacherWhatsApp.trim(),
      students,
    };

    await onSaveCourse(payload, editingCourseId);
    setModalVisible(false);
  };

  const confirmDelete = (course) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${course.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteCourse(course._id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Subject Management</Text>
          <Text style={styles.headerSubtitle}>Courses, Teachers & Students</Text>
        </View>

        <TouchableOpacity style={styles.addCourseBtn} onPress={openAddModal}>
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addCourseBtnText}>Add Course</Text>
        </TouchableOpacity>
      </View>

      {/* Courses List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isActive = activeCourse?._id === item._id;
          const studentCount = item.students ? item.students.length : 0;

          return (
            <View
              style={[
                styles.courseCard,
                SHADOWS.card,
                isActive && styles.activeCourseCard,
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardTop}>
                <View style={styles.titleArea}>
                  <View style={styles.titleBadgeRow}>
                    {item.code ? (
                      <View style={styles.codePill}>
                        <Text style={styles.codePillText}>{item.code}</Text>
                      </View>
                    ) : null}
                    {isActive ? (
                      <View style={styles.activePill}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activePillText}>ACTIVE FOR SWIPING</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.courseTitle}>{item.name}</Text>
                </View>

                <View style={styles.topRightActions}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => openEditModal(item)}
                  >
                    <Feather name="edit-2" size={15} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => confirmDelete(item)}
                  >
                    <Feather name="trash-2" size={15} color={COLORS.absent} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Meta details */}
              <View style={styles.cardMetaGrid}>
                <View style={styles.metaItem}>
                  <Feather name="user" size={14} color={COLORS.primaryLight} />
                  <Text style={styles.metaLabel}>Teacher:</Text>
                  <Text style={styles.metaValue}>{item.teacherName}</Text>
                </View>

                <View style={styles.metaItem}>
                  <FontAwesome5 name="whatsapp" size={14} color={COLORS.whatsapp} />
                  <Text style={styles.metaLabel}>WhatsApp:</Text>
                  <Text style={[styles.metaValue, { color: COLORS.whatsapp }]}>
                    {item.teacherWhatsApp}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Feather name="users" size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaLabel}>Enrolled:</Text>
                  <Text style={[styles.metaValue, { color: '#FFFFFF' }]}>
                    {studentCount} Students
                  </Text>
                </View>
              </View>

              {/* Action Button: Start swiping or already active */}
              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  isActive ? styles.selectedBtn : styles.unselectedBtn,
                ]}
                onPress={() => onSelectCourse(item)}
              >
                <Ionicons
                  name={isActive ? 'play-circle' : 'finger-print'}
                  size={18}
                  color={isActive ? '#FFFFFF' : COLORS.primaryLight}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.selectBtnText,
                    isActive ? { color: '#FFFFFF' } : { color: '#FFFFFF' },
                  ]}
                >
                  {isActive ? 'Active Course (Ready to Swipe)' : 'Start Swiping Attendance'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* ADD / EDIT COURSE MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCourseId ? 'Edit Course' : 'Create Course'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Subject Name */}
              <Text style={styles.inputLabel}>Subject / Course Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Distributed Computing"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
              />

              {/* Code */}
              <Text style={styles.inputLabel}>Course Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. CS-401"
                placeholderTextColor={COLORS.textMuted}
                value={code}
                onChangeText={setCode}
              />

              {/* Teacher Name */}
              <Text style={styles.inputLabel}>Teacher Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Dr. Tariq Mahmood"
                placeholderTextColor={COLORS.textMuted}
                value={teacherName}
                onChangeText={setTeacherName}
              />

              {/* Teacher WhatsApp */}
              <Text style={styles.inputLabel}>Teacher WhatsApp (with Country Code) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. +923001234567 or +14155552671"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={teacherWhatsApp}
                onChangeText={setTeacherWhatsApp}
              />

              {/* Student Roster Section */}
              <View style={styles.rosterSectionHeader}>
                <View>
                  <Text style={styles.inputLabel}>
                    Student Roster ({students.length})
                  </Text>
                  <Text style={styles.rosterSub}>Roll numbers & names</Text>
                </View>

                <View style={styles.quickGenRow}>
                  <TouchableOpacity
                    style={styles.sampleGenBtn}
                    onPress={generateSampleStudents}
                  >
                    <Text style={styles.sampleGenText}>+10 Sample</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bulkBtn}
                    onPress={() => setBulkModalVisible(true)}
                  >
                    <Text style={styles.bulkBtnText}>Bulk Paste</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add Single Student Input Bar */}
              <View style={styles.singleStudentAddBar}>
                <TextInput
                  style={[styles.textInput, styles.rollInput]}
                  placeholder="Roll #"
                  placeholderTextColor={COLORS.textMuted}
                  value={rollInput}
                  onChangeText={setRollInput}
                />
                <TextInput
                  style={[styles.textInput, styles.nameInput]}
                  placeholder="Student Full Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={nameInput}
                  onChangeText={setNameInput}
                />
                <TouchableOpacity
                  style={styles.addStudentBtn}
                  onPress={handleAddStudent}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Students Preview List */}
              <View style={styles.studentsPreviewBox}>
                {students.length === 0 ? (
                  <Text style={styles.noStudentsText}>
                    No students added yet. Add individually or click "+10 Sample"
                  </Text>
                ) : (
                  students.map((student, idx) => (
                    <View key={student._id || idx} style={styles.studentChip}>
                      <View style={styles.studentChipInfo}>
                        <Text style={styles.chipRoll}>#{student.rollNo}</Text>
                        <Text style={styles.chipName}>{student.name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveStudent(student._id || student.rollNo)}
                      >
                        <Ionicons name="close-circle" size={18} color={COLORS.absent} />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveCourseModalBtn} onPress={handleSave}>
                <Text style={styles.saveCourseModalText}>
                  {editingCourseId ? 'Update Course' : 'Create Course'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* BULK IMPORT MODAL */}
      <Modal
        visible={bulkModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setBulkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bulk Paste Student Roster</Text>
              <TouchableOpacity onPress={() => setBulkModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.rosterSub}>
              Paste names line-by-line (e.g. "01 - John Doe" or just "John Doe"):
            </Text>
            <TextInput
              style={styles.bulkTextArea}
              multiline
              numberOfLines={8}
              placeholder={'01 - Alex Turner\n02 - Beth Harmon\n03 - Charlie Kelly'}
              placeholderTextColor={COLORS.textMuted}
              value={bulkText}
              onChangeText={setBulkText}
            />
            <TouchableOpacity style={styles.saveCourseModalBtn} onPress={handleBulkImport}>
              <Text style={styles.saveCourseModalText}>Import Students</Text>
            </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
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
  addCourseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  addCourseBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  courseCard: {
    backgroundColor: '#172235',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 18,
  },
  activeCourseCard: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#1A243D',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleArea: {
    flex: 1,
    marginRight: 10,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  codePill: {
    backgroundColor: COLORS.bgCardHover,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codePillText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 11,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
    marginRight: 5,
  },
  activePillText: {
    color: COLORS.present,
    fontWeight: '800',
    fontSize: 10,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#0F1726',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardMetaGrid: {
    backgroundColor: '#0F1726',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  unselectedBtn: {
    backgroundColor: COLORS.bgCardHover,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  selectedBtn: {
    backgroundColor: COLORS.primary,
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
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
    maxHeight: '88%',
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
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F1726',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  rosterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  rosterSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  quickGenRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleGenBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  sampleGenText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  bulkBtn: {
    backgroundColor: COLORS.bgCardHover,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bulkBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  singleStudentAddBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  rollInput: {
    width: 75,
    marginBottom: 0,
  },
  nameInput: {
    flex: 1,
    marginBottom: 0,
  },
  addStudentBtn: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentsPreviewBox: {
    backgroundColor: '#0F1726',
    borderRadius: 14,
    padding: 10,
    maxHeight: 150,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noStudentsText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 14,
  },
  studentChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  studentChipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipRoll: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 12,
    marginRight: 8,
  },
  chipName: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  saveCourseModalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveCourseModalText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  bulkTextArea: {
    backgroundColor: '#0F1726',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 12,
    textAlignVertical: 'top',
  },
});
