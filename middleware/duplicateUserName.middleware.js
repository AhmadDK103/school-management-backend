const pool = require('../config/db.config')
const { genericResponse, USER_RESPONSES } = require('../constant/responses')


const duplicateUserName = async (req, res, next) => {
    const user_name = req?.body?.user_name

    const [result] = await pool.query(`SELECT * FROM users WHERE user_name = '${user_name}'`)

    try {
        if (result.length !== 0) {
            const response = genericResponse(
                400,
                false,
                null,
                USER_RESPONSES.USERNAME_ALREADY_EXISTS
            )
            console.log(response)
            return res.status(response.status.code).json(response);
            // return res.status(400).json({message: 'Username already exists'})
        } else {
            next()
        }
    } catch (err) {
        console.log(err.message);
        const response = genericResponse(500, false, null, err.message);
        return res.status(response.status.code).json(response);
    }
}

module.exports = {
    duplicateUserName
}