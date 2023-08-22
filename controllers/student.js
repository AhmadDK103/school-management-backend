const Joi = require('joi');
const pool = require('../config/db.config');
const { genericResponse, USER_RESPONSES, ENTITY_RESPONSES } = require('../constant/responses');

const getAllStudents = async (req, res) => {

    try {
        const [result] = await pool.query(`SELECT * FROM students`)
        if (result.length == 0) {
            const response = genericResponse(
                400,
                false,
                null,
                ENTITY_RESPONSES.SUCCESS
            )
            return res.status(response.status.code).json(response)
        } else {
            const response = genericResponse(
                200,
                true,
                result,
                null,
                "success",
            )
            return res.status(response.status.code).json(response)
        }
    } catch (err) {

    }
}

const createStudentSchema = Joi.object({
    class_id: Joi.number().strict().required(),
    first_name: Joi.string().strict().required(),
    last_name: Joi.string().strict().required(),
    father_name: Joi.string().strict().required(),
    dob: Joi.string().strict().required(),
    gender: Joi.string().strict().required(),
    previous_school: Joi.string().strict().required(),
    academic_certification: Joi.string().strict().required(),
    passed_class: Joi.string().strict().required(),
    religion: Joi.string().strict().required(),
    age: Joi.string().strict().required(),
    contact: Joi.string().strict().required(),
    country: Joi.string().strict().required(),
    city: Joi.string().strict().required(),
    address: Joi.string().strict().required(),

})

const createStudent = async (req, res) => {

    const { error } = createStudentSchema.validate(req.body)
    if (error) {
        return res.status(200).json({ message: error.details[0].message })
    }
    const { class_id, first_name, last_name,
        father_name, dob, gender, previous_school,
        academic_certification, passed_class,
        religion, age, contact, country, city, address } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const result = await pool.query(`INSERT INTO students(
            class_id,   first_name, last_name,
        father_name, dob,gender, previous_school,
        academic_certification, passed_class,
        religion, age, contact, country, city, address 
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [class_id, first_name, last_name,
                father_name, dob, gender, previous_school,
                academic_certification, passed_class,
                religion, age, contact, country, city, address]
        )

        await conn.commit()
        const response = genericResponse(
            200,
            true,
            result,
            null,
            "Student Created"
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

const updateStudent = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const { error } = createStudentSchema.validate(req.body)
    if (error) {
        return res.status(200).json({ message: error.details[0].message })
    }
    const [result] = await pool.query(`SELECT * FROM students WHERE id = '${id}'`)
    console.log(result)
    if (result.length == 0) {
        const response = genericResponse(
            400,
            false,
            null,
            ENTITY_RESPONSES.NOT_FOUND
        )
        return res.status(response.status.code).json(response)
    }

    const { class_id, first_name, last_name,
        father_name, dob, gender, previous_school,
        academic_certification, passed_class,
        religion, age, contact, country, city, address } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [result] = await pool.query(`UPDATE students SET class_id = ?, first_name =?, last_name =?,
father_name=?, dob=?, gender=?, previous_school=?,
academic_certification=?, passed_class=?,
religion=?, age=?, contact=?, country=?, city=?, address=? WHERE id = ?`,
            [class_id, first_name, last_name,
                father_name, dob, gender, previous_school,
                academic_certification, passed_class,
                religion, age, contact, country, city, address, id]
        )
        await conn.commit();
        const response = genericResponse(
            200,
            true,
            result,
            null,
            "updated successfully"
        )
        return res.status(response.status.code).json(response)
    } catch (err) {
        await conn.rollback()
        console.log(err)
        return res.status(500).json({ message: err.message })
    } finally {
        conn.release()
    }
}

const deleteStudent = async (req, res) => {
    const id = req?.params?.id
    if (!id) {
        res.status(400).json({ message: "Invalid student ID" });
        return;
    }
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const result = await pool.query(`DELETE FROM students WHERE id = '${id}'`)
        if (result[0]?.affectedRows === 0) {
            res.status(404).json({ message: "Student not found" })
        } else {
            await conn.commit()
            res.status(200).json({ message: "Student was deleted" })
        }
    } catch (err) {
        await conn.rollback()
        console.log(err)
        res.status(500).json({ message: err.message })
    } finally {
        conn.release()
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
}