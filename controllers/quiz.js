const pool = require('../config/db.config')
const { genericResponse, ENTITY_RESPONSES } = require('../constant/responses')
const { quizSchema } = require('../validations/quizValidation')

const getAllQuizByClass = async (req, res) => {
    console.log(req)
    try {
        const [quiz] = await pool.query("SELECT * FROM questions")

        if (quiz.length == 0) {
            const response = genericResponse(
                400,
                false,
                null,
                ENTITY_RESPONSES.NOT_FOUND
            )

            return res.status(response.status.code).json(response)
        } else {
            const quizArra = quiz.map((i) => {
                return {
                    id: i.id,
                    quiz_id: i.quiz_id,
                    question: i.question,
                    options: i.options.split(',').map(option => option.replace(/"/g, '').trim()),
                    correct_answer: i.correct_answer
                };
            })
            const response = genericResponse(
                200,
                true,
                quizArra,
                null,
                "success",
            )
            return res.status(response.status.code).json(response)
        }

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const createQuiz = async (req, res) => {
    console.log(req.body)
    const { error } = quizSchema.validate(req.body)
    if (error) {
        return res.status(200).json({ message: error.details[0].message })
    }

    const { subject_id, class_id, quiz_title, start_time, end_time, created_by } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const result = await pool.query(`INSERT INTO 
            quiz(subject_id, class_id, quiz_title, start_time, end_time, created_by) 
            VALUES(?,?,?,?,?,?)`,
            [subject_id, class_id, quiz_title, start_time, end_time, created_by])
        await conn.commit()
        const response = genericResponse(
            200,
            true,
            result,
            null,
            "Quiz Created"
        )
        return res.status(response.status.code).json(response)
    } catch (err) {
        await conn.rollback()
        const response = genericResponse(
            500,
            false,
            null,
            err.message
        )
        console.log(err.message)
        return res.status(response.status.code).json(response)
    } finally {
        conn.release()
    }

}

module.exports = { getAllQuizByClass, createQuiz }