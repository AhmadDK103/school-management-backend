const mysql = require("mysql2/promise");

// console.log(process.env.HOST,process.env.DATABASE,process.env.PORT_DB)
const pool = mysql.createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT_DB,
});

module.exports = pool;