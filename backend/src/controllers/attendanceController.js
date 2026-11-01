const Attendance = require('../models/Attendance');
const { getDbStatus } = require('../config/db');

// In-memory fallback attendance records
let memoryAttendance = [
  {
    _id: 'att-sample-1',
    courseId: 'default-course-1',
    courseName: 'Advanced Mobile Application Development',
    teacherName: 'Dr. Tariq Mahmood',
    teacherWhatsApp: '+1234567890',
    date: '2026-10-20',
    timestamp: new Date('2026-10-20T10:30:00Z'),
    summary: {
      total: 10,
      presentCount: 9,
      absentCount: 1,
      percentage: 90,
    },
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
    notes: 'Lecture 12 - Mobile architecture and gestures',
    createdAt: new Date('2026-10-20T10:30:00Z').toISOString(),
  },
  {
    _id: 'att-sample-2',
    courseId: 'default-course-1',
    courseName: 'Advanced Mobile Application Development',
    teacherName: 'Dr. Tariq Mahmood',
    teacherWhatsApp: '+1234567890',
    date: '2026-10-18',
    timestamp: new Date('2026-10-18T09:15:00Z'),
    summary: {
      total: 10,
      presentCount: 8,
      absentCount: 2,
      percentage: 80,
    },
    records: [
      { studentId: 's1', rollNo: '01', name: 'Ali Ahmed', status: 'PRESENT' },
      { studentId: 's2', rollNo: '02', name: 'Fatima Zahra', status: 'PRESENT' },
      { studentId: 's3', rollNo: '03', name: 'Muhammad Bilal', status: 'PRESENT' },
      { studentId: 's4', rollNo: '04', name: 'Ayesha Noor', status: 'PRESENT' },
      { studentId: 's5', rollNo: '05', name: 'Hamza Tariq', status: 'ABSENT' },
      { studentId: 's6', rollNo: '06', name: 'Zainab Bibi', status: 'PRESENT' },
      { studentId: 's7', rollNo: '07', name: 'Usman Ghani', status: 'ABSENT' },
      { studentId: 's8', rollNo: '08', name: 'Sara Khan', status: 'PRESENT' },
      { studentId: 's9', rollNo: '09', name: 'Zayan Malik', status: 'PRESENT' },
      { studentId: 's10', rollNo: '10', name: 'Haniya Imran', status: 'PRESENT' },
    ],
    notes: 'Lecture 11 - State management patterns',
    createdAt: new Date('2026-10-18T09:15:00Z').toISOString(),
  },
];

// @desc    Save new attendance session
// @route   POST /api/attendance
exports.saveAttendance = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      teacherName,
      teacherWhatsApp,
      date,
      records,
      notes,
    } = req.body;

    if (!courseName || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseName, date, and valid records array',
      });
    }

    const total = records.length;
    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const absentCount = total - presentCount;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    const summary = {
      total,
      presentCount,
      absentCount,
      percentage,
    };

    if (getDbStatus()) {
      // Upsert: replace attendance if same course and date already logged
      const existing = await Attendance.findOne({ courseId, date });
      if (existing) {
        existing.records = records;
        existing.summary = summary;
        existing.notes = notes || existing.notes;
        existing.teacherName = teacherName || existing.teacherName;
        existing.teacherWhatsApp = teacherWhatsApp || existing.teacherWhatsApp;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Attendance updated', data: existing });
      }

      const newAttendance = await Attendance.create({
        courseId,
        courseName,
        teacherName,
        teacherWhatsApp,
        date,
        records,
        summary,
        notes: notes || '',
      });
      return res.status(201).json({ success: true, message: 'Attendance recorded', data: newAttendance });
    }

    // In-memory fallback
    const existingIndex = memoryAttendance.findIndex(
      (a) => a.courseId === courseId && a.date === date
    );

    const recordData = {
      _id: existingIndex !== -1 ? memoryAttendance[existingIndex]._id : 'att_' + Date.now(),
      courseId,
      courseName,
      teacherName: teacherName || '',
      teacherWhatsApp: teacherWhatsApp || '',
      date,
      timestamp: new Date(),
      records,
      summary,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      memoryAttendance[existingIndex] = recordData;
    } else {
      memoryAttendance.unshift(recordData);
    }

    return res.status(201).json({ success: true, message: 'Attendance recorded', data: recordData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance history with filters
// @route   GET /api/attendance
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { courseId, date, limit = 50 } = req.query;
    const query = {};
    if (courseId) query.courseId = courseId;
    if (date) query.date = date;

    if (getDbStatus()) {
      const records = await Attendance.find(query)
        .sort({ date: -1, createdAt: -1 })
        .limit(parseInt(limit, 10));
      return res.status(200).json({ success: true, count: records.length, data: records });
    }

    let filtered = [...memoryAttendance];
    if (courseId) {
      filtered = filtered.filter((r) => String(r.courseId) === String(courseId));
    }
    if (date) {
      filtered = filtered.filter((r) => r.date === date);
    }
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const record = await Attendance.findById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Attendance record not found' });
      }
      return res.status(200).json({ success: true, data: record });
    }

    const record = memoryAttendance.find((r) => r._id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const deleted = await Attendance.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.status(200).json({ success: true, message: 'Attendance deleted' });
    }

    const index = memoryAttendance.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    memoryAttendance.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Attendance deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
