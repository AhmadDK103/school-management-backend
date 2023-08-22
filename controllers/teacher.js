const express = require('express')
const router = express.Router()
const pool = require('../config/db.config');
const { genericResponse, ENTITY_RESPONSES } = require('../constant/responses');
const Joi = require("joi");

const getAllTeachers = async (req, res) => {
    const [allTeachers] = await pool.query("SELECT * FROM teacher")
    console.log(allTeachers)
    if (allTeachers.length == 0) {
        const response = genericResponse(
            400,
            false,
            null,
            ENTITY_RESPONSES.NOT_FOUND
        )
        return res.status(response.status.code).json(response)
    } else {
        const response = genericResponse(
            200,
            true,
            allTeachers,
            null,
            ENTITY_RESPONSES.SUCCESS
        )
        return res.status(response.status.code).json(response)
    }
}

const createTeacherSchema = Joi.object({
    first_name: Joi.string().strict().required(),
    last_name: Joi.string().strict().required(),
    email: Joi.string().email().required(),
    user_name: Joi.string().strict().required(),
    password: Joi.string().strict().required(),
    date_of_birth: Joi.string().strict().required(),
    gender: Joi.string().valid("male", "female", "other").strict().required(),
    assigned_class: Joi.number().strict().required(),
    address: Joi.string().strict().required(),
    department: Joi.string().strict().required()
})

const createTeacher = async (req, res) => {

    const { error } = createTeacherSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { first_name, last_name, email, user_name,
        password, date_of_birth, gender,
        assigned_class, address, department } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [result] = await pool.query
            (`INSERT INTO teacher(first_name, last_name, email,user_name, password, date_of_birth,gender,assigned_class,address,department)
         VALUES(?,?,?,?,?,?,?,?,?,?)`,
                [first_name, last_name, email, user_name, password, date_of_birth, gender, assigned_class, address, department]
            )
        await conn.commit()
        const response = genericResponse(
            200,
            true,
            result,
            null,
            "Teacher created successfully"
        )
        return res.status(response.status.code).json(response)
    } catch (err) {
        await conn.rollback();
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release()
    }
}

const updateTeacher = async (req, res) => {
    console.log(req.body)
    const id = req?.params?.teacherId
    const { error } = createTeacherSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { first_name, last_name, email, user_name,
        password, date_of_birth, gender,
        assigned_class, address, department } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        pool.query(`UPDATE teacher SET first_name = ?, last_name=?,
        password=?, date_of_birth=?, gender=?,
        assigned_class=?, address=?, department=? WHERE teacher_id = ?`,
            [first_name, last_name, password,
                date_of_birth, gender, assigned_class, address, department, id]
        )
        await conn.commit()
        return res.status(200).json({ message: "marksheet Updated" });
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release()
    }
}

const deleteTeacher = async (req, res) => {
    console.log(req?.params?.id)
    const id = req?.params?.id
    if (!id) {
        res.status(400).json({ message: "Invalid teacher ID" });
        return;
    }
    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        const result = await pool.query(`DELETE FROM teacher WHERE teacher_id = '${id}'`)
        if (result[0]?.affectedRows === 0) {
            res.status(404).json({ message: "Teacher not found" })
        } else {
            await conn.commit()
            res.status(200).json({ message: "Teacher was deleted" })
        }
    } catch (err) {
        await conn.rollback()
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    } finally {
        conn.release()
    }
}

const teacherAttendanceSchema = Joi.object({
    teacher_id: Joi.number().strict().required(),
    status: Joi.string().valid("present", "absent", "leave").strict().required(),
})
const createteacherAttendance = async (req, res) => {

    const { error } = teacherAttendanceSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { teacher_id, status } = req.body
    const currentTime = new Date();

    const conn = await pool.getConnection()

    try {
        const [[result]] = await pool.query(
            `SELECT * FROM teacher_attendance
            WHERE teacher_id = '${teacher_id}'`
        );
        if (!result) {
            await conn.beginTransaction()
            const [result] = await pool.query(`INSERT INTO teacher_attendance(teacher_id,status)
             VALUES(?,?)`,
                [teacher_id, status]
            )
            await conn.commit();
            const response = genericResponse(
                200,
                true,
                result,
                null,
                "created attendance"
            )
            return res.status(response.status.code).json(response)

        } else {
            const timeElapsed = currentTime - new Date(result.created_at);

            if (timeElapsed < 16 * 60 * 60 * 1000) { // 24 hours in milliseconds
                return res.status(403).json({ error: 'You can only create a new record after 24 hours' });
            } else {
                console.log(".,.asdasd")
                return next();
            }
        }
    } catch (err) {
        await conn.rollback();
        return res.status(500).json({ message: err.message })
    } finally {
        conn.release()
    }
}

const getAllTeacherAttendance = async (req, res) => {

    try {
        const [result] = await pool.query("SELECT * FROM teacher_attendance")
        const response = genericResponse(
            200,
            true,
            result,
            null,
            "success"
        )
        return res.status(response.status.code).json(response)
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }

}



module.exports = {
    getAllTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getAllTeacherAttendance,
    createteacherAttendance
}