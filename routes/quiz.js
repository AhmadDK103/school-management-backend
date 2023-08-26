const express = require("express")
const { getAllQuizByClass, createQuiz } = require('../controllers/quiz')

const router = express.Router()

router.get('/', getAllQuizByClass)
router.post('/create', createQuiz)

module.exports = router