/**
 * Database Configuration
 * Uses Neon serverless PostgreSQL with pg library
 * Compatible with connection pooling and serverless environments
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from server root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Increased timeouts for Neon serverless
  idleTimeoutMillis: 60000, // 60 seconds
  connectionTimeoutMillis: 10000, // 10 seconds
  // Enable SSL for Neon (always required)
  ssl: { rejectUnauthorized: false },
  max: 10, // Max connections in pool
});

// Connection pooling error handler
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

// Test connection on startup
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

export default pool;
