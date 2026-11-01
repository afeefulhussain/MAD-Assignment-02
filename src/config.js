import { Platform } from 'react-native';

// Default backend URLs based on environment
export const DEFAULT_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api', // Android emulator default
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

export const STORAGE_KEYS = {
  COURSES: '@smart_attendance_courses',
  ATTENDANCE: '@smart_attendance_logs',
  API_URL: '@smart_attendance_api_url',
  ACTIVE_COURSE_ID: '@smart_attendance_active_course_id',
};
