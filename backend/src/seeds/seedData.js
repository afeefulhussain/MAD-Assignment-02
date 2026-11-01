const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

dotenv.config();

const sampleCourses = [
  {
    name: 'Artificial Intelligence & Neural Networks',
    code: 'AI-401',
    teacherName: 'Dr. Johnathan Vance',
    teacherWhatsApp: '+14155552671',
    color: '#8B5CF6',
    students: [
      { rollNo: '01', name: 'Aaron Paul', email: 'aaron@example.com' },
      { rollNo: '02', name: 'Brianna Smith', email: 'brianna@example.com' },
      { rollNo: '03', name: 'Cyrus Vance', email: 'cyrus@example.com' },
      { rollNo: '04', name: 'Daphne Blake', email: 'daphne@example.com' },
      { rollNo: '05', name: 'Ethan Hunt', email: 'ethan@example.com' },
      { rollNo: '06', name: 'Fiona Gallagher', email: 'fiona@example.com' },
      { rollNo: '07', name: 'George Clark', email: 'george@example.com' },
      { rollNo: '08', name: 'Hannah Abbott', email: 'hannah@example.com' },
      { rollNo: '09', name: 'Ian Malcolm', email: 'ian@example.com' },
      { rollNo: '10', name: 'Julia Roberts', email: 'julia@example.com' },
    ],
  },
  {
    name: 'Full Stack Web Development',
    code: 'CS-320',
    teacherName: 'Prof. Elena Rostova',
    teacherWhatsApp: '+14155558912',
    color: '#06B6D4',
    students: [
      { rollNo: '01', name: 'Aaron Paul', email: 'aaron@example.com' },
      { rollNo: '02', name: 'Brianna Smith', email: 'brianna@example.com' },
      { rollNo: '03', name: 'Cyrus Vance', email: 'cyrus@example.com' },
      { rollNo: '04', name: 'Daphne Blake', email: 'daphne@example.com' },
      { rollNo: '05', name: 'Ethan Hunt', email: 'ethan@example.com' },
    ],
  },
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_app';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    await Course.deleteMany({});
    await Attendance.deleteMany({});

    const createdCourses = await Course.insertMany(sampleCourses);
    console.log(`Seeded ${createdCourses.length} courses successfully!`);

    // Add a sample attendance record
    const course1 = createdCourses[0];
    const records = course1.students.map((student, idx) => ({
      studentId: String(student._id),
      rollNo: student.rollNo,
      name: student.name,
      status: idx === 3 || idx === 6 ? 'ABSENT' : 'PRESENT',
    }));

    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    await Attendance.create({
      courseId: course1._id,
      courseName: course1.name,
      teacherName: course1.teacherName,
      teacherWhatsApp: course1.teacherWhatsApp,
      date: new Date().toISOString().split('T')[0],
      records,
      summary: {
        total: records.length,
        presentCount,
        absentCount: records.length - presentCount,
        percentage: Math.round((presentCount / records.length) * 100),
      },
      notes: 'Initial seeded attendance log',
    });

    console.log('Seeded sample attendance record!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
