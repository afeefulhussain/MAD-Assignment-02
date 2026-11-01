import { Linking, Alert, Share } from 'react-native';

/**
 * Format a beautiful, professional WhatsApp report
 */
export function formatWhatsAppReport({
  courseName,
  courseCode,
  teacherName,
  date,
  records,
  notes,
}) {
  const total = records.length;
  const presentStudents = records.filter((r) => r.status === 'PRESENT');
  const absentStudents = records.filter((r) => r.status === 'ABSENT');
  const percentage = total > 0 ? Math.round((presentStudents.length / total) * 100) : 0;

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let message = `📋 *SMART ATTENDANCE REPORT*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📚 *Subject:* ${courseName}${courseCode ? ` (${courseCode})` : ''}\n`;
  if (teacherName) {
    message += `👨‍🏫 *Teacher:* ${teacherName}\n`;
  }
  message += `📅 *Date:* ${formattedDate}\n`;
  message += `👥 *Total Students:* ${total}\n`;
  message += `✅ *Present:* ${presentStudents.length} (${percentage}%)\n`;
  message += `❌ *Absent:* ${absentStudents.length} (${100 - percentage}%)\n`;

  if (notes && notes.trim().length > 0) {
    message += `📝 *Notes:* ${notes.trim()}\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (presentStudents.length > 0) {
    message += `✅ *PRESENT STUDENTS (${presentStudents.length}):*\n`;
    presentStudents.forEach((s) => {
      message += ` • [${s.rollNo}] ${s.name}\n`;
    });
    message += `\n`;
  }

  if (absentStudents.length > 0) {
    message += `❌ *ABSENT STUDENTS (${absentStudents.length}):*\n`;
    absentStudents.forEach((s) => {
      message += ` • [${s.rollNo}] ${s.name}\n`;
    });
    message += `\n`;
  }

  message += `_Report generated via Smart Attendance App_`;

  return message;
}

/**
 * Clean and format phone number for WhatsApp wa.me link
 * Removes +, spaces, dashes, parentheses
 */
export function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

/**
 * Direct WhatsApp Integration: Opens chat with teacher and prefilled message
 */
export async function sendAttendanceViaWhatsApp({
  teacherWhatsApp,
  courseName,
  courseCode,
  teacherName,
  date,
  records,
  notes,
}) {
  const message = formatWhatsAppReport({
    courseName,
    courseCode,
    teacherName,
    date,
    records,
    notes,
  });

  const sanitizedNumber = sanitizePhoneNumber(teacherWhatsApp);
  const encodedText = encodeURIComponent(message);

  if (!sanitizedNumber) {
    // If no phone number provided, offer system Share dialog
    Alert.alert(
      'No Teacher WhatsApp Number',
      'Teacher WhatsApp number is missing for this course. Would you like to share the report via standard share?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share Report',
          onPress: () => Share.share({ message, title: `Attendance - ${courseName}` }),
        },
      ]
    );
    return false;
  }

  // Construct official WhatsApp direct URL
  const waUrl = `https://wa.me/${sanitizedNumber}?text=${encodedText}`;
  const deepLink = `whatsapp://send?phone=${sanitizedNumber}&text=${encodedText}`;

  try {
    const supported = await Linking.canOpenURL(deepLink);
    if (supported) {
      await Linking.openURL(deepLink);
      return true;
    } else {
      // Fallback to web link
      await Linking.openURL(waUrl);
      return true;
    }
  } catch (error) {
    console.warn('Failed to open WhatsApp directly:', error);
    // Fallback to general share dialog
    try {
      await Share.share({
        message,
        title: `Attendance Report - ${courseName}`,
      });
      return true;
    } catch (shareErr) {
      Alert.alert('Error Sharing Report', 'Could not open WhatsApp or system share.');
      return false;
    }
  }
}
