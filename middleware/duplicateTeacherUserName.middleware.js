const pool = require('../config/db.config')
const { genericResponse, USER_RESPONSES } = require('../constant/responses')

const duplicateTeacherUserName = async (req, res,next) => {
    const { user_name } = req.body

    const [result] = await pool.query(`SELECT * FROM teacher WHERE user_name = '${user_name}'`)
    try {
        if (result.length !== 0) {
            const response = genericResponse(
                400,
                false,
                null,
                USER_RESPONSES.USERNAME_ALREADY_EXISTS
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
module.exports = duplicateTeacherUserName