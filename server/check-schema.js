import pool from './config/database.js';

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'students' 
      ORDER BY ordinal_position
    `);
    console.log('\n📊 Students Table Schema:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n📊 Teachers Table Schema:');
    const teachersResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teachers' 
      ORDER BY ordinal_position
    `);
    teachersResult.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkSchema();
