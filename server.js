require("dotenv").config();
const mysql = require("mysql");
const express = require("express");
const app = express();
const roster = require("./roster");
const PORT = 5088;

const connection = mysql.createConnection({
  host: process.env.S_HOST,
  port: 3306,
  user: process.env.S_USER,
  password: process.env.S_PASS,
  database: "roster_db",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connection.connect((err) => {
  if (err) throw err;
  console.log("connected");
});

app.listen(PORT, () => {
  console.log(`Listening at : http://localhost:` + PORT);
  // connection.end();
});
