const express = require('express');
const { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, createteacherAttendance, getAllTeacherAttendance } = require('../controllers/teacher');
const duplicateTeacherEmail = require('../middleware/duplicateTeacherEmail.middleware');
const duplicateTeacherUserName = require('../middleware/duplicateTeacherUserName.middleware');

const router = express.Router();

router.get('/',getAllTeachers)
router.post('/create',duplicateTeacherEmail,duplicateTeacherUserName, createTeacher)
router.put('/:teacherId',updateTeacher)
router.delete('/:id',deleteTeacher);
router.get('/attendance',getAllTeacherAttendance)
router.post('/attendance',createteacherAttendance)


module.exports = router