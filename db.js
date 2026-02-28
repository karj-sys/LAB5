// API-SERVER/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '', // Check if your MySQL has a password
  database: process.env.DB_NAME || 'mental_health_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;