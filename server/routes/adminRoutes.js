/**
 * Admin Routes
 * All routes require admin role
 * /api/admin/*
 */

import express from 'express';
import { 
  createUser, 
  createSubject, 
  getStats, 
  getReport,
  getSubjects,
  getAllStudents,
  getAllTeachers,
  updateUser,
  deleteUser,
  updateSubject,
  deleteSubject,
  getGPAReport,
  getFailedStudents,
  getTopPerformers,
} from '../controllers/adminController.js';
import { authMiddleware, authorizeRole } from '../middleware/auth.js';
import { 
  validateCreateUser, 
  validateCreateSubject, 
  validate 
} from '../middleware/validation.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(authorizeRole('admin'));

/**
 * POST /api/admin/create-user
 * Create a new student or teacher
 * Body: { name, email, password, role, department, roll_number?, semester?, qualification? }
 */
router.post('/create-user', validateCreateUser, validate, createUser);

/**
 * POST /api/admin/create-subject
 * Create a new subject
 */
router.post('/create-subject', validateCreateSubject, validate, createSubject);

/**
 * GET /api/admin/stats
 * Get system-wide statistics
 */
router.get('/stats', getStats);

/**
 * GET /api/admin/report
 * Get performance report (all students, all marks)
 */
router.get('/report', getReport);

/**
 * GET /api/admin/subjects
 * Get all subjects with teacher assignments
 */
router.get('/subjects', getSubjects);

/**
 * GET /api/admin/all-students
 * Get all students with details
 */
router.get('/all-students', getAllStudents);

/**
 * GET /api/admin/all-teachers
 * Get all teachers with details
 */
router.get('/all-teachers', getAllTeachers);

/**
 * PUT /api/admin/user/:userId
 * Update user details
 */
router.put('/user/:userId', updateUser);

/**
 * DELETE /api/admin/user/:userId
 * Delete a user
 */
router.delete('/user/:userId', deleteUser);

/**
 * PUT /api/admin/subject/:subjectId
 * Update subject details
 */
router.put('/subject/:subjectId', updateSubject);

/**
 * DELETE /api/admin/subject/:subjectId
 * Delete a subject
 */
router.delete('/subject/:subjectId', deleteSubject);

/**
 * GET /api/admin/gpa-report
 * Get GPA report for all students (student, sem, dept, gpa, cgpa)
 */
router.get('/gpa-report', getGPAReport);

/**
 * GET /api/admin/failed-students
 * Get all failed students with details
 */
router.get('/failed-students', getFailedStudents);

/**
 * GET /api/admin/top-performers
 * Get top performing students by GPA
 * Query: ?limit=10
 */
router.get('/top-performers', getTopPerformers);

export default router;
