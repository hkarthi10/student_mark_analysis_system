import pg from 'pg';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
  let client;
  try {
    console.log('🚀 Initializing database...');
    client = await pool.connect();
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    console.log('📋 Creating tables...');
    await client.query(schema);
    console.log('✅ Tables created successfully!');
    
    // Create admin user
    console.log('👤 Creating admin account...');
    const adminName = 'Admin User';
    const adminEmail = 'admin@college.edu';
    const adminPassword = 'admin@1234';
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, role`,
      [adminName, adminEmail, hashedPassword, 'admin', 'CS']
    );
    
    if (result.rows.length > 0) {
      console.log('\n✅ Admin Account Created Successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    ' + adminEmail);
      console.log('🔑 Password: ' + adminPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Database already initialized, skipping...');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

initializeDatabase().catch(console.error);
