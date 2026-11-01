import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { DEFAULT_API_URL, STORAGE_KEYS } from './config';

// Rich demo courses with realistic student rosters
export const INITIAL_DEMO_COURSES = [
  {
    _id: 'course-1',
    name: 'Advanced Mobile Application Development',
    code: 'CS-401',
    teacherName: 'Dr. Tariq Mahmood',
    teacherWhatsApp: '+923001234567',
    color: '#6366F1', // Indigo
    students: [
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
    ],
  },
  {
    _id: 'course-2',
    name: 'Database Management Systems',
    code: 'CS-302',
    teacherName: 'Prof. Sarah Jenkins',
    teacherWhatsApp: '+14155552671',
    color: '#06B6D4', // Cyan
    students: [
      { _id: 's1', rollNo: '01', name: 'Ali Ahmed' },
      { _id: 's2', rollNo: '02', name: 'Fatima Zahra' },
      { _id: 's4', rollNo: '04', name: 'Ayesha Noor' },
      { _id: 's7', rollNo: '07', name: 'Usman Ghani' },
      { _id: 's8', rollNo: '08', name: 'Sara Khan' },
      { _id: 's11', rollNo: '11', name: 'Danyal Aslam' },
      { _id: 's12', rollNo: '12', name: 'Maria Santos' },
    ],
  },
  {
    _id: 'course-3',
    name: 'Artificial Intelligence & Machine Learning',
    code: 'AI-501',
    teacherName: 'Dr. Alex Rivera',
    teacherWhatsApp: '+447911123456',
    color: '#10B981', // Emerald
    students: [
      { _id: 's2', rollNo: '02', name: 'Fatima Zahra' },
      { _id: 's3', rollNo: '03', name: 'Muhammad Bilal' },
      { _id: 's5', rollNo: '05', name: 'Hamza Tariq' },
      { _id: 's9', rollNo: '09', name: 'Zayan Malik' },
      { _id: 's10', rollNo: '10', name: 'Haniya Imran' },
    ],
  },
];

export async function getApiBaseUrl() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    return saved || DEFAULT_API_URL;
  } catch {
    return DEFAULT_API_URL;
  }
}

export async function setApiBaseUrl(url) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url.trim());
  } catch (e) {
    console.error('Error saving API URL:', e);
  }
}

export async function checkBackendHealth() {
  const baseUrl = await getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${baseUrl}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
    return { online: false, message: `Status ${res.status}` };
  } catch (error) {
    return { online: false, message: 'Offline (using local storage)' };
  }
}

// ----------------- COURSES -----------------

export async function getCourses() {
  // Return local storage immediately for 0ms fast startup on mobile phones
  let localCourses = null;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    if (stored) {
      localCourses = JSON.parse(stored);
    }
  } catch {}

  if (!localCourses || localCourses.length === 0) {
    localCourses = INITIAL_DEMO_COURSES;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_DEMO_COURSES));
    } catch {}
  }

  return { data: localCourses, source: 'local' };
}

export async function createCourse(coursePayload) {
  const newCourse = {
    ...coursePayload,
    _id: 'course_' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  // Save to local storage first
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newCourse);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(list));
  } catch {}

  // Attempt backend sync in background
  const baseUrl = await getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    fetch(`${baseUrl}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coursePayload),
      signal: controller.signal,
    }).catch(() => {});
    clearTimeout(timeoutId);
  } catch {}

  return newCourse;
}

export async function updateCourse(id, coursePayload) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    if (existing) {
      const list = JSON.parse(existing);
      const index = list.findIndex((c) => c._id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...coursePayload, updatedAt: new Date().toISOString() };
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(list));
      }
    }
  } catch {}

  const baseUrl = await getApiBaseUrl();
  try {
    fetch(`${baseUrl}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coursePayload),
    }).catch(() => {});
  } catch {}

  return coursePayload;
}

export async function deleteCourse(id) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    if (existing) {
      const list = JSON.parse(existing).filter((c) => c._id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(list));
    }
  } catch {}

  const baseUrl = await getApiBaseUrl();
  try {
    fetch(`${baseUrl}/courses/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch {}
  return true;
}

// ----------------- ATTENDANCE -----------------

export async function saveAttendanceSession(payload) {
  const total = payload.records.length;
  const presentCount = payload.records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = total - presentCount;
  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  const savedRecord = {
    ...payload,
    _id: 'att_' + Date.now(),
    summary: {
      total,
      presentCount,
      absentCount,
      percentage,
    },
    createdAt: new Date().toISOString(),
  };

  // Update local storage history immediately
  try {
    const local = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const history = local ? JSON.parse(local) : [];
    const existingIndex = history.findIndex(
      (h) => h.courseId === payload.courseId && h.date === payload.date
    );
    if (existingIndex !== -1) {
      history[existingIndex] = savedRecord;
    } else {
      history.unshift(savedRecord);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving local attendance:', e);
  }

  // Background sync with backend
  const baseUrl = await getApiBaseUrl();
  try {
    fetch(`${baseUrl}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}

  return savedRecord;
}

export async function getAttendanceHistory(courseId = null) {
  // Always read local storage first for instant feedback
  let history = [];
  try {
    const local = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (local) {
      history = JSON.parse(local);
    }
  } catch {}

  // If empty, provide sample seed history for immediate visual demonstration
  if (!history || history.length === 0) {
    const sampleHistory = [
      {
        _id: 'att-sample-1',
        courseId: 'course-1',
        courseName: 'Advanced Mobile Application Development',
        teacherName: 'Dr. Tariq Mahmood',
        teacherWhatsApp: '+923001234567',
        date: new Date().toISOString().split('T')[0],
        summary: { total: 10, presentCount: 9, absentCount: 1, percentage: 90 },
        records: [
          { studentId: 's1', rollNo: '01', name: 'Ali Ahmed', status: 'PRESENT' },
          { studentId: 's2', rollNo: '02', name: 'Fatima Zahra', status: 'PRESENT' },
          { studentId: 's3', rollNo: '03', name: 'Muhammad Bilal', status: 'PRESENT' },
          { studentId: 's4', rollNo: '04', name: 'Ayesha Noor', status: 'ABSENT' },
          { studentId: 's5', rollNo: '05', name: 'Hamza Tariq', status: 'PRESENT' },
          { studentId: 's6', rollNo: '06', name: 'Zainab Bibi', status: 'PRESENT' },
          { studentId: 's7', rollNo: '07', name: 'Usman Ghani', status: 'PRESENT' },
          { studentId: 's8', rollNo: '08', name: 'Sara Khan', status: 'PRESENT' },
          { studentId: 's9', rollNo: '09', name: 'Zayan Malik', status: 'PRESENT' },
          { studentId: 's10', rollNo: '10', name: 'Haniya Imran', status: 'PRESENT' },
        ],
      },
    ];
    history = sampleHistory;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sampleHistory));
    } catch {}
  }

  if (courseId) {
    return { data: history.filter((h) => String(h.courseId) === String(courseId)), source: 'local' };
  }
  return { data: history, source: 'local' };
}
