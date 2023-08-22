const express = require('express')
const { getAllAttendance, createAttendance } = require('../controllers/attendance')
const checkAttendance24Hours = require('../middleware/checkAttendance24Hours.middleware')

const router = express.Router()


router.get('/', getAllAttendance)
router.post('/',checkAttendance24Hours,createAttendance)




module.exports = router