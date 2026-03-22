import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createTestData() {
  try {
    // Create student user
    const studentPassword = await bcrypt.hash('password123', 10);
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT(email) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, email`,
      ['Test Student', 'student@example.com', studentPassword, 'student', 'CSE']
    );
    
    const userId = userResult.rows[0].id;
    console.log('✅ Student user created:', userResult.rows[0].email);
    
    // Create student record
    const studentResult = await pool.query(
      `INSERT INTO students (user_id, roll_number, semester, year_of_study) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT(user_id) DO NOTHING
       RETURNING id`,
      [userId, 'CS001', 1, 1]
    );
    
    if (studentResult.rows.length > 0) {
      const studentId = studentResult.rows[0].id;
      console.log('✅ Student record created:', studentId);
      
      // Create teacher
      const teacherPassword = await bcrypt.hash('teacher123', 10);
      const teacherResult = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, department) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT(email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id`,
        ['Test Teacher', 'teacher@example.com', teacherPassword, 'teacher', 'CSE']
      );
      
      const teacherId = teacherResult.rows[0].id;
      console.log('✅ Teacher user created');
      
      // Create teacher record
      const teacherRecordResult = await pool.query(
        `INSERT INTO teachers (user_id) 
         VALUES ($1) 
         ON CONFLICT(user_id) DO NOTHING
         RETURNING id`,
        [teacherId]
      );
      
      const teacherRecordId = teacherRecordResult.rows.length > 0 
        ? teacherRecordResult.rows[0].id 
        : (await pool.query(`SELECT id FROM teachers WHERE user_id = $1`, [teacherId])).rows[0].id;
      
      console.log('✅ Teacher record created');
      
      // Create subject
      const subjectResult = await pool.query(
        `INSERT INTO subjects (subject_code, subject_name, credits, department, teacher_id) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT(subject_code) DO UPDATE SET teacher_id = EXCLUDED.teacher_id
         RETURNING id`,
        ['CS101', 'Programming', 4, 'CSE', teacherRecordId]
      );
      
      const subjectId = subjectResult.rows[0].id;
      console.log('✅ Subject created');
      
      // Create marks (total_marks is auto-calculated from internal + external)
      const marksResult = await pool.query(
        `INSERT INTO marks (student_id, subject_id, internal_marks, external_marks, grade) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT(student_id, subject_id) DO UPDATE 
         SET internal_marks = EXCLUDED.internal_marks, 
             external_marks = EXCLUDED.external_marks, 
             grade = EXCLUDED.grade
         RETURNING id`,
        [studentId, subjectId, 35, 55, 'O']
      );
      
      console.log('✅ Marks created');
      console.log('\nTest data ready! Login with:');
      console.log('  Email: student@example.com');
      console.log('  Password: password123');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createTestData();
