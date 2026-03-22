import pool from './config/database.js';

async function checkStudents() {
  try {
    const result = await pool.query('SELECT id, name, email, roll_number FROM users WHERE role = $1', ['student']);
    console.log('\n✅ Total Students:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('\n📋 Student List:');
      result.rows.forEach(s => {
        console.log(`  - ${s.name} (${s.email}) - Roll: ${s.roll_number}`);
      });
    } else {
      console.log('⚠️  No students found. Please create students first via Admin panel.');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkStudents();
