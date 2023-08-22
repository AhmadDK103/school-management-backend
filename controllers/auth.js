const pool = require('../config/db.config')

const Joi = require("joi");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { genericResponse, USER_RESPONSES } = require('../constant/responses');

const userSchema = Joi.object({
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const signup = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    console.log(error)
    if (error) {
        // return res.status(400).json({ message: error.details[0].message });
        const response = genericResponse(
            400,
            false,
            null,
            error.details[0].message
        );
        console.log(response,)
        return res.status(response.status.code).json(response);

    }
    console.log(req.body)
    const { user_name, email, password } = req?.body
    const hashPassword = await bcrypt.hash(password, 10)
    console.log(hashPassword)
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [{ insertId: userId }] = await pool.query(
            `INSERT INTO users(user_name,email,password) VALUES(?,?, ?)`,
            [user_name, email, hashPassword]
        );
        await conn.commit();
        const token = jwt.sign(
            {
                userId: userId,
            },
            process.env.JWT_SECRET_KEY
        );
        console.log(token)
        // res.status(200).json({ message: "User Created" });
        const response = genericResponse(201, true, {
            access_token: token,
        });
        return res.status(response.status.code).json(response);
    } catch (err) {
        await conn.rollback();
        // Handle the error appropriately
        console.error(err, "*************");
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release();
    }

}

const loginServices = async (userData) => {
    const { email, password } = userData
    try {
        const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (!user) {
            return USER_RESPONSES.INCORRECT_CREDENTIALS
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return USER_RESPONSES.INCORRECT_CREDENTIALS
        }
        const accessToken = jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_SECRET_KEY
        )
        return accessToken
    } catch (err) {
        console.log(err)
        throw new Error(err.message);
    }

}

const login = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body)
    if (error) {
        const response = genericResponse(
            400,
            false,
            null,
            error.details[0].message
        )
        return res.status(response.status.code).json(response)
    }
    try {
        const responseMessage = await loginServices(req.body)
        console.log(responseMessage)
        if (responseMessage === USER_RESPONSES.INCORRECT_CREDENTIALS) {
            const response = genericResponse(
                401,
                false,
                null,
                USER_RESPONSES.INCORRECT_CREDENTIALS
            );
            return res.status(response.status.code).json(response);
        }
        const response = genericResponse(
            200,
            true, { access_token: responseMessage }
        )
        return res.status(response.status.code).json(response)

    } catch (err) {
        const response = genericResponse(
            500,
            false,
            null,
            err.message
        );
        return res.status(response.status.code).json(response);
    }

}

module.exports = {
    signup,
    login
}