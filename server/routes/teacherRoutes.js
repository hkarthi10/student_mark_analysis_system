/**
 * Teacher Routes
 * All routes require teacher role
 * /api/teacher/*
 */

import express from 'express';
import { 
  enterMarks, 
  updateMarks, 
  getSubjectAnalysis,
  getMySubjects,
  getStudents,
} from '../controllers/teacherController.js';
import { authMiddleware, authorizeRole } from '../middleware/auth.js';
import { validateCreateMarks, validateUpdateMarks, validate } from '../middleware/validation.js';

const router = express.Router();

// Protect all teacher routes
router.use(authMiddleware);
router.use(authorizeRole('teacher'));

/**
 * POST /api/teacher/marks
 * Enter marks for a student
 * Body: { student_id, subject_id, internal_marks, external_marks }
 */
router.post('/marks', validateCreateMarks, validate, enterMarks);

/**
 * PUT /api/teacher/marks/:marksId
 * Update existing marks
 * Body: { internal_marks?, external_marks? }
 */
router.put('/marks/:marksId', validateUpdateMarks, validate, updateMarks);

/**
 * GET /api/teacher/subject-analysis/:subjectId
 * Get analysis for a specific subject
 */
router.get('/subject-analysis/:subjectId', getSubjectAnalysis);

/**
 * GET /api/teacher/my-subjects
 * Get all subjects taught by the logged-in teacher
 */
router.get('/my-subjects', getMySubjects);

/**
 * GET /api/teacher/students
 * Get all students (for entering marks)
 */
router.get('/students', getStudents);

export default router;
