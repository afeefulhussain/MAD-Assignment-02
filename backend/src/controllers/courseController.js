const Course = require('../models/Course');
const { getDbStatus } = require('../config/db');

// In-memory fallback repository when MongoDB is not connected
let memoryCourses = [
  {
    _id: 'default-course-1',
    name: 'Advanced Mobile Application Development',
    code: 'CS-401',
    teacherName: 'Dr. Tariq Mahmood',
    teacherWhatsApp: '+1234567890',
    color: '#6366F1',
    students: [
      { _id: 's1', rollNo: '01', name: 'Ali Ahmed', email: 'ali@example.com' },
      { _id: 's2', rollNo: '02', name: 'Fatima Zahra', email: 'fatima@example.com' },
      { _id: 's3', rollNo: '03', name: 'Muhammad Bilal', email: 'bilal@example.com' },
      { _id: 's4', rollNo: '04', name: 'Ayesha Noor', email: 'ayesha@example.com' },
      { _id: 's5', rollNo: '05', name: 'Hamza Tariq', email: 'hamza@example.com' },
      { _id: 's6', rollNo: '06', name: 'Zainab Bibi', email: 'zainab@example.com' },
      { _id: 's7', rollNo: '07', name: 'Usman Ghani', email: 'usman@example.com' },
      { _id: 's8', rollNo: '08', name: 'Sara Khan', email: 'sara@example.com' },
      { _id: 's9', rollNo: '09', name: 'Zayan Malik', email: 'zayan@example.com' },
      { _id: 's10', rollNo: '10', name: 'Haniya Imran', email: 'haniya@example.com' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'default-course-2',
    name: 'Database Management Systems',
    code: 'CS-302',
    teacherName: 'Prof. Sarah Jenkins',
    teacherWhatsApp: '+1987654321',
    color: '#06B6D4',
    students: [
      { _id: 's1', rollNo: '01', name: 'Ali Ahmed', email: 'ali@example.com' },
      { _id: 's2', rollNo: '02', name: 'Fatima Zahra', email: 'fatima@example.com' },
      { _id: 's4', rollNo: '04', name: 'Ayesha Noor', email: 'ayesha@example.com' },
      { _id: 's7', rollNo: '07', name: 'Usman Ghani', email: 'usman@example.com' },
      { _id: 's8', rollNo: '08', name: 'Sara Khan', email: 'sara@example.com' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// @desc    Get all courses/subjects
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    if (getDbStatus()) {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: courses.length, data: courses });
    }
    return res.status(200).json({ success: true, count: memoryCourses.length, data: memoryCourses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      return res.status(200).json({ success: true, data: course });
    }

    const course = memoryCourses.find((c) => c._id === id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const { name, code, teacherName, teacherWhatsApp, students, color } = req.body;
    if (!name || !teacherName || !teacherWhatsApp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course name, teacher name, and teacher WhatsApp number',
      });
    }

    if (getDbStatus()) {
      const newCourse = await Course.create({
        name,
        code: code || '',
        teacherName,
        teacherWhatsApp,
        students: students || [],
        color: color || '#6366F1',
      });
      return res.status(201).json({ success: true, data: newCourse });
    }

    const newCourse = {
      _id: 'course_' + Date.now(),
      name,
      code: code || '',
      teacherName,
      teacherWhatsApp,
      students: (students || []).map((s, idx) => ({
        _id: 's_' + (Date.now() + idx),
        rollNo: s.rollNo || String(idx + 1).padStart(2, '0'),
        name: s.name,
        email: s.email || '',
      })),
      color: color || '#6366F1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryCourses.unshift(newCourse);
    return res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, teacherName, teacherWhatsApp, students, color } = req.body;

    if (getDbStatus()) {
      const course = await Course.findByIdAndUpdate(
        id,
        { name, code, teacherName, teacherWhatsApp, students, color },
        { new: true, runValidators: true }
      );
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      return res.status(200).json({ success: true, data: course });
    }

    const index = memoryCourses.findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    memoryCourses[index] = {
      ...memoryCourses[index],
      ...(name !== undefined && { name }),
      ...(code !== undefined && { code }),
      ...(teacherName !== undefined && { teacherName }),
      ...(teacherWhatsApp !== undefined && { teacherWhatsApp }),
      ...(students !== undefined && { students }),
      ...(color !== undefined && { color }),
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({ success: true, data: memoryCourses[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      return res.status(200).json({ success: true, message: 'Course deleted successfully' });
    }

    const index = memoryCourses.findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    memoryCourses.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
