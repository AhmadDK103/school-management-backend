require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000;
const products_routes = require('./routes/products')
const auth_routes = require('./routes/auth')
const marksheet_routes = require('./routes/marksheet')
const attendance_routes = require('./routes/attendance')
const teacher_routes = require('./routes/teacher');
const student_routes = require('./routes/student')
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.send('Hi i am home page, i am live')
})


// middleware or set to router

app.use('/api/auth',auth_routes)
app.use('/api/products',products_routes)
app.use('/api/marksheets',marksheet_routes)
app.use('/api/attendance' ,attendance_routes)
app.use('/api/teacher',teacher_routes)
app.use('/api/student',student_routes)


const start = async () => {
    try {
        app.listen(PORT,()=>{
            console.log(`${PORT} Yes i am connected`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()