import pool from './config/database.js';

async function checkStudents() {
  try {
    console.log('\n--- Students Table ---');
    const studentsResult = await pool.query(`
      SELECT u.id, u.name, u.email, s.roll_no, s.semester 
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      WHERE u.role = 'student'
      LIMIT 10
    `);
    console.log(`Total Students: ${studentsResult.rows.length}`);
    if (studentsResult.rows.length > 0) {
      console.log('\nStudents:');
      studentsResult.rows.forEach(s => {
        console.log(`  - ${s.name} (${s.email}) - Roll: ${s.roll_no}, Sem: ${s.semester}`);
      });
    } else {
      console.log('❌ No students found!');
    }

    console.log('\n--- Teachers Table ---');
    const teachersResult = await pool.query(`
      SELECT u.id, u.name, u.email, t.qualification
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      WHERE u.role = 'teacher'
      LIMIT 10
    `);
    console.log(`Total Teachers: ${teachersResult.rows.length}`);
    if (teachersResult.rows.length > 0) {
      console.log('\nTeachers:');
      teachersResult.rows.forEach(t => {
        console.log(`  - ${t.name} (${t.email}) - ${t.qualification}`);
      });
    }

    console.log('\n--- Subjects Table ---');
    const subjectsResult = await pool.query(`
      SELECT s.id, s.subject_code, s.subject_name, u.name as teacher_name
      FROM subjects s
      LEFT JOIN users u ON s.teacher_id = u.id
      LIMIT 10
    `);
    console.log(`Total Subjects: ${subjectsResult.rows.length}`);
    if (subjectsResult.rows.length > 0) {
      console.log('\nSubjects:');
      subjectsResult.rows.forEach(s => {
        console.log(`  - ${s.subject_code}: ${s.subject_name} (Teacher: ${s.teacher_name})`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkStudents();
