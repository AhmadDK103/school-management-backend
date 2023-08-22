
const pool = require('../config/db.config')
const { genericResponse, USER_RESPONSES } = require('../constant/responses')


const duplicateEmail = async (req, res, next) => {
    const email = req?.body?.email
    const [result] = await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
    console.log(result)

    try {
        if (result.length !== 0) {
            // return res.status(400).json({message: 'Email already exists'})
            const response = genericResponse(
                400,
                false,
                null,
                USER_RESPONSES.EMAIL_ALREADY_EXISTS
            );
            console.log(response,)
            return res.status(response.status.code).json(response);
        }
        next()
    } catch (err) {
        console.log(err.message);
        const response = genericResponse(500, false, null, err.message);
        return res.status(response.status.code).json(response);
    }
}


module.exports = duplicateEmail