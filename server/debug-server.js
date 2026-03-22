import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import poolConfig from './config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('1. Starting server...');
console.log('2. Imports loaded');

// Load .env explicitly from server folder
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('3. .env loaded from:', path.join(__dirname, '.env'));
console.log('   DATABASE_URL set:', !!process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 5000;

console.log('4. Port:', PORT);

// Test database directly
(async () => {
  console.log('5. Testing database...');
  try {
    const result = await poolConfig.query('SELECT NOW()');
    console.log('✅ Database OK:', result.rows[0]);
    
    // Now start server
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database error:', err.message);
    console.error('Full error:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
})();
