const pool = require("../config/db.config")

const getAllProducts = async (req,res) => {
    try{

        const [users] = await pool.query( `SELECT * FROM users`)
        console.log(users)
        res.status(200).json({message:"I am  getAllProducts "})
    } catch(err) {
        console.log(err)
    }
    
}

const getAllProductsTesting =async(req,res)=>{
    res.status(200).json({message:"i am getAllProductstesting"})
}

module.exports = {getAllProducts,getAllProductsTesting}