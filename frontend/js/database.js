import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "your_host",
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "your_database_name",
  port: process.env.DB_PORT || 3306,
});

export default pool;
