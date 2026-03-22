/**
 * Password Hashing Utilities using bcryptjs
 */

import bcrypt from 'bcryptjs';

/**
 * Hash password with salt rounds
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain text password with hash
 * @param {string} password - Plain text password to check
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
