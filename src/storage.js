import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENTS_KEY = '@attendance_app_students';
const ATTENDANCE_KEY = '@attendance_app_attendance_records';

export const INITIAL_STUDENTS = [
  { id: '1', rollNo: '01', name: 'Ali Ahmed' },
  { id: '2', rollNo: '02', name: 'Fatima Zahra' },
  { id: '3', rollNo: '03', name: 'Muhammad Bilal' },
  { id: '4', rollNo: '04', name: 'Ayesha Noor' },
  { id: '5', rollNo: '05', name: 'Hamza Tariq' },
  { id: '6', rollNo: '06', name: 'Zainab Bibi' },
  { id: '7', rollNo: '07', name: 'Usman Ghani' },
  { id: '8', rollNo: '08', name: 'Sara Khan' },
  { id: '9', rollNo: '09', name: 'Zayan Malik' },
  { id: '10', rollNo: '10', name: 'Haniya Imran' },
];

export async function getStoredStudents() {
  try {
    const jsonValue = await AsyncStorage.getItem(STUDENTS_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    // Store initial default students for first time
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (e) {
    console.error('Error reading students:', e);
    return INITIAL_STUDENTS;
  }
}

export async function saveStudents(students) {
  try {
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students:', e);
  }
}

export async function getAllAttendanceRecords() {
  try {
    const jsonValue = await AsyncStorage.getItem(ATTENDANCE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Error reading attendance:', e);
    return {};
  }
}

export async function saveAttendanceForDate(dateKey, records) {
  try {
    const allRecords = await getAllAttendanceRecords();
    allRecords[dateKey] = records;
    await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(allRecords));
    return allRecords;
  } catch (e) {
    console.error('Error saving attendance:', e);
    return {};
  }
}
