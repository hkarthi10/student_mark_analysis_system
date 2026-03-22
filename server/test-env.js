import dotenv from 'dotenv';

dotenv.config();

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ? 'YES (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NO');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('.env file status: OK');
