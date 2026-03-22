import pool from './config/database.js';

async function checkAllData() {
  try {
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n📊 Total Users: ${userResult.rows[0].count}`);

    const studentResult = await pool.query(`
      SELECT u.id, u.name, u.email, s.roll_number, s.semester 
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      WHERE u.role = 'student'
    `);
    console.log(`\n👥 Students: ${studentResult.rows.length}`);
    if (studentResult.rows.length > 0) {
      studentResult.rows.forEach(s => {
        console.log(`  - ${s.name} (${s.email}) - Roll: ${s.roll_number}, Sem: ${s.semester}`);
      });
    } else {
      console.log('  ❌ No students found!');
    }

    const teacherResult = await pool.query(`
      SELECT u.id, u.name, u.email
      FROM users u
      WHERE u.role = 'teacher'
    `);
    console.log(`\n🎓 Teachers: ${teacherResult.rows.length}`);
    if (teacherResult.rows.length > 0) {
      teacherResult.rows.forEach(t => {
        console.log(`  - ${t.name} (${t.email})`);
      });
    }

    const subjectResult = await pool.query(`
      SELECT s.id, s.subject_code, s.subject_name
      FROM subjects s
    `);
    console.log(`\n📚 Subjects: ${subjectResult.rows.length}`);
    if (subjectResult.rows.length > 0) {
      subjectResult.rows.forEach(s => {
        console.log(`  - ${s.subject_code}: ${s.subject_name}`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkAllData();
