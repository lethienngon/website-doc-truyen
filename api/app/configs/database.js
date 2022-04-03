'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost:3306",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "web_truyen"
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  }); 

module.exports = db;