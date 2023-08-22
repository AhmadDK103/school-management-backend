const express = require('express')
const router = express.Router()

const { createMarksheet, getAllMarksheet,getMarksheetById, updateMarksheet, searchMarksheet, deleteMarksheet, getMarksheetByStudentId } = require('../controllers/marksheet')

router.get('/search', searchMarksheet)
router.get('/',getAllMarksheet)
router.get('/marksheet/:marksheetId',getMarksheetById)
router.get('/student/marksheet/:studentId',getMarksheetByStudentId)
router.patch('/:marksheetId',updateMarksheet)
router.delete('/:id',deleteMarksheet)
router.post('/',createMarksheet)



module.exports = router