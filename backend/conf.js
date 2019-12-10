require("dotenv").config();
const mysql = require("mysql");

const backendPort = process.env.BACKEND_PORT || "4200";

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "example.org",
  user: process.env.DB_USER || "bob",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_DATABASE || "my_db"
});

module.exports = {
  backendPort,
  db
};
