import bcrypt from 'bcryptjs';
import pool from './config/database.js'; // تأكد أن المسار صحيح لملف database.js

async function createUser() {
  const username = 'admin';          // اسم المستخدم الجديد
  const plainPassword = '123456';    // كلمة المرور
  const role = 'admin';              // الدور

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // إدراج المستخدم في قاعدة البيانات
  await pool.execute(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role]
  );

  console.log('User created successfully!');
  process.exit();
}

createUser();
