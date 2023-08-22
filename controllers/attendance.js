const pool = require('../config/db.config')

const Joi = require("joi");



const createAttendanceSchema = Joi.object({

    student_id: Joi.number().integer().strict().required(),
    class_id: Joi.number().integer().strict().required(),
    status: Joi.string().valid("present","absent","leave") .strict().required(),
});






const createAttendance = async (req, res) => {
    const { error } = createAttendanceSchema.validate(req.body);
    console.log(error,"*******************")
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    console.log("body:", req.body)
    const { student_id, class_id, status } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await pool.query(
            `INSERT INTO attendance(student_id,class_id,status) VALUES(?,?,?)`,
            [student_id, class_id, status]
        )
        await conn.commit()
        res.status(200).json({ message: "created attendance" })

    } catch (err) {
        await conn.rollback()
        // Check if the error is related to a foreign key constraint
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
            res.status(400).json({ message: "Invalid student_id or class_id provided" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    } finally {
        conn.release()
    }

}


const getAllAttendance = async (req, res) => {

    try {
        const [attendance] = await pool.query('SELECT * FROM attendance')
        console.log(attendance)
        res.status(200).json(attendance)
    } catch (err) {
        console.log(err)
    }

}


module.exports = { getAllAttendance, createAttendance }