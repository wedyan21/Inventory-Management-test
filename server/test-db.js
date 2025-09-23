import pool from './config/database.js';

async function testDB() {
  try {
    const [rows] = await pool.execute('SELECT 1+1 AS result');
    console.log('DB works:', rows);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

testDB();
