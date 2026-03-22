/**
 * Student Routes
 * All routes require student role
 * /api/student/*
 */

import express from 'express';
import { 
  getMyMarks, 
  getPerformanceAnalysis,
  getStudentReport,
  getCGPA,
} from '../controllers/studentController.js';
import { authMiddleware, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Protect all student routes
router.use(authMiddleware);
router.use(authorizeRole('student'));

/**
 * GET /api/student/marks
 * Get marksheet for logged-in student
 */
router.get('/marks', getMyMarks);

/**
 * GET /api/student/performance
 * Get performance analysis
 */
router.get('/performance', getPerformanceAnalysis);

/**
 * GET /api/student/report
 * Get downloadable report
 */
router.get('/report', getStudentReport);

/**
 * GET /api/student/cgpa
 * Get CGPA for all semesters
 */
router.get('/cgpa', getCGPA);

export default router;
