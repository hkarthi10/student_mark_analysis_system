/**
 * Authentication Routes
 * POST /api/auth/login
 */

import express from 'express';
import { login } from '../controllers/authController.js';
import { validateLogin, validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, message, data: { token, user } }
 */
router.post('/login', validateLogin, validate, login);

export default router;
