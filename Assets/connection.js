require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.S_HOST,
  port: 3306,
  user: process.env.S_USER,
  password: process.env.S_PASS,
  database: "roster_db",
});

module.exports = connection;
