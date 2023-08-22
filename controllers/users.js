const pool = require("../config/db.config");

const getAllUsers = async (req, res) => {
    try {

        const [users] = await pool.query(`SELECT * FROM users`)
        console.log(users)
        res.status(200).json(users)
    } catch (err) {
        console.log(err)
    }
}

const createUser = async (req, res) => {
    console.log("body:", req.body)
    const { name, contact } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await pool.query(`INSERT INTO users(name,contact) VALUES(?,?)`, [name, contact])
        await conn.commit();
        res.status(200).json({ message: "User Created" })
    } catch (err) {
        await conn.rollback()
    } finally {
        conn.release()
    }


}
const updateUser = async (req, res) => {
    const userId = req.params.userId
    const { name, contact } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await pool.query(`UPDATE users SET name = ?, contact = ? WHERE id = ?`, [name, contact,userId])
        await conn.commit();
        res.status(200).json({ message: "User Updated" })
    } catch (err) {
        await conn.rollback()
    } finally {
        conn.release()
    }


}
const deleteUser = async (req, res) => {
    const userId = req.params.userId
    const { name, contact } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await pool.query(`DELETE FROM users  WHERE id =  ?`, [userId])
        await conn.commit();
        res.status(200).json({ message: "User Deleted" })
    } catch (err) {
        await conn.rollback()
    } finally {
        conn.release()
    }
}

const getAllUsersTesting = async (req, res) => {
    res.status(200).json({ testingUser: "john Doe" })
}


module.exports = { getAllUsers, createUser,updateUser, deleteUser,getAllUsersTesting }