/**
 * Teacher Controller
 * Handles mark entry, updates, and subject analysis
 */

import pool from '../config/database.js';

/**
 * POST /api/teacher/marks
 * Enter marks for a student in a subject
 */
export const enterMarks = async (req, res, next) => {
  try {
    const { student_id, subject_id, internal_marks, external_marks } = req.body;

    // Verify teacher teaches this subject
    const teacherSubjectResult = await pool.query(
      `SELECT t.id FROM teachers t
       JOIN subjects s ON t.id = s.teacher_id
       WHERE s.id = $1 AND t.user_id = $2`,
      [subject_id, req.user.id]
    );

    if (teacherSubjectResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'You do not teach this subject.',
      });
    }

    // Calculate total and grade
    const total = internal_marks + external_marks;
    const grade = calculateGrade(total);

    // Insert or update marks
    const result = await pool.query(
      `INSERT INTO marks (student_id, subject_id, internal_marks, external_marks, grade)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, subject_id) DO UPDATE SET
         internal_marks = $3,
         external_marks = $4,
         grade = $5,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [student_id, subject_id, internal_marks, external_marks, grade]
    );

    res.status(201).json({
      success: true,
      message: 'Marks entered/updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/teacher/marks/:marksId
 * Update existing marks
 */
export const updateMarks = async (req, res, next) => {
  try {
    const { marksId } = req.params;
    const { internal_marks, external_marks } = req.body;

    // Get current marks and verify teacher
    const currentMarksResult = await pool.query(
      `SELECT m.*, s.teacher_id FROM marks m
       JOIN subjects s ON m.subject_id = s.id
       JOIN teachers t ON s.teacher_id = t.id
       WHERE m.id = $1 AND t.user_id = $2`,
      [marksId, req.user.id]
    );

    if (currentMarksResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized or marks not found.',
      });
    }

    const marks = currentMarksResult.rows[0];
    const newInternal = internal_marks ?? marks.internal_marks;
    const newExternal = external_marks ?? marks.external_marks;
    const total = newInternal + newExternal;
    const grade = calculateGrade(total);

    const result = await pool.query(
      `UPDATE marks SET
        internal_marks = $1,
        external_marks = $2,
        grade = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [newInternal, newExternal, grade, marksId]
    );

    res.status(200).json({
      success: true,
      message: 'Marks updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/teacher/subject-analysis/:subjectId
 * Get analysis for a subject taught by the teacher
 */
export const getSubjectAnalysis = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    // Verify teacher teaches this subject
    const teacherSubjectResult = await pool.query(
      `SELECT t.id FROM teachers t
       JOIN subjects s ON t.id = s.teacher_id
       WHERE s.id = $1 AND t.user_id = $2`,
      [subjectId, req.user.id]
    );

    if (teacherSubjectResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'You do not teach this subject.',
      });
    }

    // Get subject info and analysis
    const subjectResult = await pool.query(
      `SELECT * FROM subjects WHERE id = $1`,
      [subjectId]
    );

    const analysisResult = await pool.query(
      `SELECT 
        COUNT(*) as total_students,
        ROUND(AVG(m.total_marks), 2) as class_average,
        MAX(m.total_marks) as highest_marks,
        MIN(m.total_marks) as lowest_marks,
        COUNT(CASE WHEN m.total_marks >= 45 THEN 1 END) as pass_count,
        COUNT(CASE WHEN m.total_marks < 45 THEN 1 END) as fail_count,
        ROUND(100.0 * COUNT(CASE WHEN m.total_marks >= 45 THEN 1 END) / NULLIF(COUNT(*), 0), 2) as pass_percentage
       FROM marks m
       WHERE m.subject_id = $1`,
      [subjectId]
    );

    // Get topper
    const topperResult = await pool.query(
      `SELECT 
        u.name,
        st.roll_number,
        m.total_marks,
        m.grade
       FROM marks m
       JOIN students st ON m.student_id = st.id
       JOIN users u ON st.user_id = u.id
       WHERE m.subject_id = $1
       ORDER BY m.total_marks DESC
       LIMIT 1`,
      [subjectId]
    );

    // Get arrear list (failed students: total_marks < 45, grade = 'U')
    const arrearResult = await pool.query(
      `SELECT 
        u.name,
        st.roll_number,
        m.total_marks,
        m.grade
       FROM marks m
       JOIN students st ON m.student_id = st.id
       JOIN users u ON st.user_id = u.id
       WHERE m.subject_id = $1 AND m.total_marks < 45
       ORDER BY u.name`,
      [subjectId]
    );

    res.status(200).json({
      success: true,
      data: {
        subject: subjectResult.rows[0],
        analysis: analysisResult.rows[0],
        topper: topperResult.rows[0] || null,
        arrear_list: arrearResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/teacher/students
 * Get all students (for entering marks)
 */
export const getStudents = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        u.id as user_id,
        u.name,
        u.email,
        s.roll_number,
        s.semester
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE u.role = 'student'
       ORDER BY s.roll_number`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/teacher/my-subjects
 * Get all subjects taught by the logged-in teacher
 */
export const getMySubjects = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.subject_code,
        s.subject_name,
        s.department,
        s.credits,
        s.semester,
        COUNT(m.id) as enrolled_students,
        COUNT(CASE WHEN m.grade IS NOT NULL THEN 1 END) as marks_entered
       FROM subjects s
       JOIN teachers t ON s.teacher_id = t.id
       LEFT JOIN marks m ON s.id = m.subject_id
       WHERE t.user_id = $1
       GROUP BY s.id, s.subject_code, s.subject_name, s.department, s.credits, s.semester
       ORDER BY s.subject_code`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper function to calculate grade
 * Uses Anna University grading system
 * 90-100 → O (10)
 * 80-89 → A+ (9)
 * 70-79 → A (8)
 * 60-69 → B+ (7)
 * 50-59 → B (6)
 * 45-49 → C (5)
 * Below 45 → U (0, fail)
 */
function calculateGrade(total) {
  if (total >= 90) return 'O';
  if (total >= 80) return 'A+';
  if (total >= 70) return 'A';
  if (total >= 60) return 'B+';
  if (total >= 50) return 'B';
  if (total >= 45) return 'C';
  return 'U';
}
