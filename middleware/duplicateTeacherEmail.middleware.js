const pool = require('../config/db.config')
const { genericResponse, USER_RESPONSES } = require('../constant/responses')

const duplicateTeacherEmail = async (req, res, next) => {

    const { email } = req.body
    const [result] = await pool.query(`SELECT * FROM teacher WHERE email = '${email}'`)
    console.log(result)
    try {
        if (result.length !== 0) {
            const response = genericResponse(
                400,
                false,
                null,
                USER_RESPONSES.EMAIL_ALREADY_EXISTS
            )
            return res.status(response.status.code).json(response)
        }
        next()
    } catch (err) {
        const response = genericResponse(
            500,
            false,
            null,
            err.message
        )
        return res.status(response.status.code).json(response)
    }

}

module.exports = duplicateTeacherEmail