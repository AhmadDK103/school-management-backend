const pool = require('../config/db.config');
const Joi = require("joi");


const getAllMarksheet = async (req, res) => {
    console.log(req.query)
    try {
        const [marksheet] = await pool.query('SELECT * FROM marksheet')
        console.log(marksheet)
        res.status(200).json(marksheet)
    } catch (err) {
        console.log(err)
    }
}

const getMarksheetById = async (req, res) => {
    const id = req?.params?.marksheetId
    try {
        const [marksheet] = await pool.query(`SELECT * FROM marksheet WHERE id = ${id}`)
        if (marksheet.length === 0) {
            // If marksheet is an empty array, the id does not exist in the database
            res.status(404).json({ error: "Marksheet not found for the provided ID" });
        } else {
            res.status(200).json(...marksheet);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }
}
const getMarksheetByStudentId = async (req, res) => {
    const id = req?.params?.studentId
    console.log(id)
    try {
        const [marksheet] = await pool.query(`SELECT * FROM marksheet WHERE student_id = ${id}`)
        console.log(marksheet)
        if (marksheet.length === 0) {
            // If marksheet is an empty array, the id does not exist in the database
            res.status(404).json({ error: "Marksheet not found for the provided ID" });
        } else {
            res.status(200).json(marksheet);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }
}

const searchMarksheet = async (req, res) => {
    const { name, percentage } = req.query;
    console.log(percentage)
    // Validate searchName and/or searchRollNumber if needed
    // ...

    let query;
    let queryParams = [];

    if (name && percentage) {
        // If both name and roll number are provided, search with both criteria
        query = 'SELECT * FROM marksheet WHERE name LIKE ? AND percentage = ?';
        queryParams = [`%${name}%`, percentage];
    } else if (name) {
        // If only name is provided, search by name
        query = 'SELECT * FROM marksheet WHERE name LIKE ?';
        queryParams = [`%${name}%`];
    } else if (percentage) {
        // If only roll number is provided, search by roll number
        query = 'SELECT * FROM marksheet WHERE percentage >= ?';
        queryParams = [percentage];
    } else {
        return res.status(400).json({ message: "Please provide a name or roll number for the search." });
    }

    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(query, queryParams);

        if (result.length === 0) {
            return res.status(404).json({ message: "Marksheet not found" });
        }

        res.status(200).json({ data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release();
    }
};

const createMarksheetSchema = Joi.object({

    student_id: Joi.number().integer().strict().required(),
    urdu: Joi.number().integer().strict().required(),
    math: Joi.number().integer().strict().required(),
    physics: Joi.number().integer().strict().required(),
    chemistry: Joi.number().integer().strict().required(),
    total: Joi.number().integer().strict().required(),
});

const createMarksheet = async (req, res) => {
    const { error } = createMarksheetSchema.validate(req.body);
    console.log(error)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    console.log("body:", req.body)
    const { student_id, urdu, math, physics, chemistry, total } = req.body;
    const obtained = urdu + math + physics + chemistry;
    const percentage = (obtained * 100) / total;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await pool.query(
            `INSERT INTO marksheet(student_id,urdu, math, physics, chemistry, total, obtained, percentage) VALUES(?,?, ?,?,?, ?,?, ?)`,
            [student_id, urdu, math, physics, chemistry, total, obtained, percentage]
        );
        await conn.commit();
        res.status(200).json({ message: "marksheet Created" });
    } catch (err) {
        await conn.rollback();
        // Handle the error appropriately
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release();
    }
};

const updateMarksheet = async (req, res) => {
    const id = req?.params?.marksheetId
    const { error } = createMarksheetSchema.validate(res.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    console.log("body:", req.body)
    const { roll_number, name, father_name, urdu, math, physics, chemistry, total } = req.body;
    const obtained = urdu + math + physics + chemistry;
    const percentage = (obtained * 100) / total;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await pool.query(
            `UPDATE marksheet SET roll_number = ?, name = ?, father_name = ?, urdu = ?, math = ?, physics = ?, chemistry = ?, total = ?, obtained = ?, percentage = ? WHERE id = ?`,
            [roll_number, name, father_name, urdu, math, physics, chemistry, total, obtained, percentage, id]
        );
        await conn.commit();
        res.status(200).json({ message: "marksheet Updated" });
    } catch (err) {
        await conn.rollback();
        // Handle the error appropriately
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        conn.release();
    }


}

const deleteMarksheet = async (req, res) => {
    console.log(req?.params?.id)
    const id = req?.params?.id
    if (!id) {
        res.status(400).json({ message: "Invalid marksheet ID" });
        return;
    }
    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        const result = await pool.query(`DELETE FROM marksheet WHERE id = ${id}`)
        if (result[0]?.affectedRows === 0) {
            res.status(404).json({ message: "Marksheet not found" })
        } else {
            await conn.commit()
            res.status(200).json({ message: "marksheet was deleted" })
        }
    } catch (err) {
        await conn.rollback()
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    } finally {
        conn.release()
    }
}
module.exports = { getAllMarksheet, getMarksheetById, createMarksheet, updateMarksheet, searchMarksheet, deleteMarksheet, getMarksheetByStudentId };