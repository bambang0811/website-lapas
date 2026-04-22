import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1", 
  user: "root",
  password: "", 
  database: "lapas_karawang",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 
});

export default pool;