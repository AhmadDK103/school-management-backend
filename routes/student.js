const express = require('express');
const { getAllStudents, createStudent, deleteStudent, updateStudent } = require('../controllers/student');

const router = express.Router();

router.post('/create', createStudent);
router.get('/', getAllStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router