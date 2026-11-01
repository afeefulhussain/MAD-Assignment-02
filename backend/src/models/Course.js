const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
});

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject/Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    teacherName: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    teacherWhatsApp: {
      type: String,
      required: [true, "Teacher's WhatsApp number with country code is required"],
      trim: true,
    },
    color: {
      type: String,
      default: '#6366F1', // Indigo accent
    },
    students: [StudentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', CourseSchema);
