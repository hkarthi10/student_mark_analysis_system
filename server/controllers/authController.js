/**
 * Authentication Controller
 * Handles user login for all roles (admin, teacher, student)
 */

import pool from '../config/database.js';
import { comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

/**
 * POST /api/auth/login
 * Authenticates user and returns JWT token
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, name, email, password_hash, role, department FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Get role-specific data
    let roleData = {};
    if (user.role === 'student') {
      const studentResult = await pool.query(
        'SELECT id, roll_number, semester FROM students WHERE user_id = $1',
        [user.id]
      );
      if (studentResult.rows.length > 0) {
        roleData = studentResult.rows[0];
      }
    } else if (user.role === 'teacher') {
      const teacherResult = await pool.query(
        'SELECT id, qualification FROM teachers WHERE user_id = $1',
        [user.id]
      );
      if (teacherResult.rows.length > 0) {
        roleData = teacherResult.rows[0];
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          ...roleData,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
