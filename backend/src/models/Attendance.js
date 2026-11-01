const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT'],
    required: true,
  },
});

const AttendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
    },
    courseName: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      default: '',
    },
    teacherWhatsApp: {
      type: String,
      default: '',
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    records: [AttendanceRecordSchema],
    summary: {
      total: { type: Number, default: 0 },
      presentCount: { type: Number, default: 0 },
      absentCount: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index to ensure efficient date and course queries
AttendanceSchema.index({ courseId: 1, date: -1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
