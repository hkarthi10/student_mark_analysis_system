/**
 * Input Validation Middleware using express-validator
 */

import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({
        field: e.param,
        message: e.msg,
      })),
    });
  }
  next();
};

// Validation chains for different endpoints

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateCreateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('Invalid role'),
  body('department').optional().trim(),
];

export const validateCreateSubject = [
  body('subject_code').trim().notEmpty().withMessage('Subject code is required'),
  body('subject_name').trim().notEmpty().withMessage('Subject name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('credits').isInt({ min: 1, max: 4 }).withMessage('Credits must be between 1 and 4'),
  body('teacher_id').optional().isInt().withMessage('Invalid teacher ID'),
];

export const validateCreateMarks = [
  body('student_id').isInt().withMessage('Student ID must be an integer'),
  body('subject_id').isInt().withMessage('Subject ID must be an integer'),
  body('internal_marks').isInt({ min: 0, max: 40 }).withMessage('Internal marks must be 0-40'),
  body('external_marks').isInt({ min: 0, max: 60 }).withMessage('External marks must be 0-60'),
];

export const validateUpdateMarks = [
  body('internal_marks').optional().isInt({ min: 0, max: 40 }).withMessage('Internal marks must be 0-40'),
  body('external_marks').optional().isInt({ min: 0, max: 60 }).withMessage('External marks must be 0-60'),
];
