const express = require('express')

const router = express.Router()

const { signup, login } = require('../controllers/auth')
const duplicateEmail = require('../middleware/duplicateEmail.middleware')
const { duplicateUserName } = require('../middleware/duplicateUserName.middleware')
router.post('/signup',duplicateEmail,duplicateUserName, signup)
router.post('/login', login)

module.exports = router