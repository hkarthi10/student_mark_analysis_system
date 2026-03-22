import pool from './config/database.js';

async function fixSubject() {
  try {
    // Get teacher ID from teachers table
    const teacherResult = await pool.query(`
      SELECT t.id FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE u.role = $1 AND u.name = $2
    `, ['teacher', 'Manoj']);
    
    if (teacherResult.rows.length === 0) {
      console.log('❌ Teacher not found in teachers table!');
      process.exit(1);
    }

    const teacherId = teacherResult.rows[0].id;
    console.log(`✅ Found teacher in teachers table (ID: ${teacherId})`);

    // Update subject with teacher
    const updateResult = await pool.query(
      'UPDATE subjects SET teacher_id = $1 WHERE subject_code = $2 RETURNING *',
      [teacherId, 'CCS356']
    );

    if (updateResult.rows.length > 0) {
      console.log('\n✅ Subject assigned to teacher successfully!');
      console.log(`  Subject: ${updateResult.rows[0].subject_name}`);
      console.log(`  Teacher ID: ${updateResult.rows[0].teacher_id}`);
      console.log('\n🎉 Now login as teacher to see the subjects and enter marks!');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

fixSubject();
