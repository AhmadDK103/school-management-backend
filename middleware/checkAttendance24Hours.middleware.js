const pool = require('../config/db.config');
const { genericResponse } = require('../constant/responses');


const checkAttendance24Hours = async (req, res, next) => {
    try {
        console.log(req.body,"******!")
        const { student_id, class_id } = req.body;

        const currentTime = new Date();

        const [[ result ]] = await pool.query(
            `SELECT * FROM attendance
            WHERE student_id = '${student_id}' && class_id = '${class_id}'`
        );
        
        if (!result) {
            console.log(".,.")
            return next();
        }
        
        const timeElapsed = currentTime - new Date(result.created_at);
        
        if (timeElapsed < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            return res.status(403).json({ error: 'You can only create a new record after 24 hours' });
        } else {
            console.log(".,.asdasd")
           return next();
        }
       
    } catch (err) {
        console.log(err.message);
        const response = genericResponse(500, false, null, err.message);
        return res.status(response.status.code).json(response);
    }

}


module.exports = checkAttendance24Hours