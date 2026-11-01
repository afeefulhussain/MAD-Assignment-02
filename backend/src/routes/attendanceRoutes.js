const express = require('express');
const router = express.Router();
const {
  saveAttendance,
  getAttendanceHistory,
  getAttendanceById,
  deleteAttendance,
} = require('../controllers/attendanceController');

router.route('/')
  .post(saveAttendance)
  .get(getAttendanceHistory);

router.route('/:id')
  .get(getAttendanceById)
  .delete(deleteAttendance);

module.exports = router;
