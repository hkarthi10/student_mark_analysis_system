/**
 * Admin Controller
 * Handles admin operations: create users, subjects, manage system, generate reports
 */

import pool from '../config/database.js';
import { hashPassword } from '../utils/password.js';
import { calculateGPA, calculateCGPA, getGradeFromMarks } from '../utils/gpa.js';

/**
 * POST /api/admin/create-user
 * Create a new user (student or teacher)
 */
export const createUser = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { name, email, password, role, department } = req.body;

    // Start transaction
    await client.query('BEGIN');

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert into users table
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, department`,
      [name, email, passwordHash, role, department]
    );

    const newUser = userResult.rows[0];

    // Insert role-specific data
    if (role === 'student') {
      const { roll_number, semester } = req.body;
      const year = Math.ceil(semester / 2);
      
      await client.query(
        `INSERT INTO students (user_id, roll_number, semester, year_of_study)
         VALUES ($1, $2, $3, $4)`,
        [newUser.id, roll_number, semester, year]
      );
    } else if (role === 'teacher') {
      const { qualification } = req.body;
      await client.query(
        `INSERT INTO teachers (user_id, qualification)
         VALUES ($1, $2)`,
        [newUser.id, qualification || 'M.Tech']
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`,
      data: newUser,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/**
 * POST /api/admin/create-subject
 * Create a new subject
 */
export const createSubject = async (req, res, next) => {
  try {
    const { subject_code, subject_name, department, credits, teacher_id, semester } = req.body;

    const result = await pool.query(
      `INSERT INTO subjects (subject_code, subject_name, department, credits, teacher_id, semester)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [subject_code, subject_name, department, credits, teacher_id || null, semester || null]
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/stats
 * Get system-wide statistics
 */
export const getStats = async (req, res, next) => {
  try {
    const totalStudentsResult = await pool.query(
      'SELECT COUNT(*) as count FROM students'
    );
    const totalTeachersResult = await pool.query(
      'SELECT COUNT(*) as count FROM teachers'
    );
    const totalSubjectsResult = await pool.query(
      'SELECT COUNT(*) as count FROM subjects'
    );
    const departmentsResult = await pool.query(
      'SELECT DISTINCT department FROM subjects WHERE department IS NOT NULL'
    );

    // Calculate pass percentage
    const passPercentageResult = await pool.query(
      `SELECT 
        ROUND(
          100.0 * COUNT(CASE WHEN grade != 'F' THEN 1 END) / NULLIF(COUNT(*), 0),
          2
        ) as pass_percentage
       FROM marks`
    );

    res.status(200).json({
      success: true,
      data: {
        total_students: parseInt(totalStudentsResult.rows[0].count),
        total_teachers: parseInt(totalTeachersResult.rows[0].count),
        total_subjects: parseInt(totalSubjectsResult.rows[0].count),
        total_departments: departmentsResult.rows.length,
        pass_percentage: passPercentageResult.rows[0].pass_percentage || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/report
 * Get performance report (ready for PDF generation)
 */
export const getReport = async (req, res, next) => {
  try {
    const report = await pool.query(
      `SELECT 
        u.name as student_name,
        st.roll_number,
        su.subject_code,
        su.subject_name,
        m.internal_marks,
        m.external_marks,
        m.total_marks,
        m.grade
       FROM marks m
       JOIN students st ON m.student_id = st.id
       JOIN users u ON st.user_id = u.id
       JOIN subjects su ON m.subject_id = su.id
       ORDER BY u.name, su.subject_code`
    );

    res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        total_records: report.rows.length,
        records: report.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/subjects
 * Get all subjects with teacher details
 */
export const getSubjects = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.subject_code,
        s.subject_name,
        s.department,
        s.credits,
        s.semester,
        s.teacher_id,
        u.name as teacher_name
       FROM subjects s
       LEFT JOIN teachers t ON s.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY s.subject_code`
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
 * GET /api/admin/all-students
 * Get all students with details
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        st.id,
        u.id as user_id,
        u.name,
        u.email,
        u.department,
        st.roll_number,
        st.semester,
        st.year_of_study
       FROM students st
       JOIN users u ON st.user_id = u.id
       ORDER BY st.roll_number`
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
 * GET /api/admin/all-teachers
 * Get all teachers with details
 */
export const getAllTeachers = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.id,
        u.id as user_id,
        u.name,
        u.email,
        u.department,
        t.qualification,
        COUNT(s.id) as subjects_teaching
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN subjects s ON t.id = s.teacher_id
       GROUP BY t.id, u.id, u.name, u.email, u.department, t.qualification
       ORDER BY u.name`
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
 * PUT /api/admin/user/:userId
 * Update user details
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, password, department } = req.body;
    
    let query = 'UPDATE users SET name = $1, email = $2, department = $3';
    let params = [name, email, department];

    if (password) {
      const passwordHash = await hashPassword(password);
      query += `, password_hash = $4`;
      params.push(passwordHash);
    }

    query += ` WHERE id = $${params.length + 1} RETURNING id, name, email, role, department`;
    params.push(userId);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/user/:userId
 * Delete a user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/subject/:subjectId
 * Update subject details
 */
export const updateSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { subject_name, credits, teacher_id, semester } = req.body;

    const result = await pool.query(
      `UPDATE subjects 
       SET subject_name = $1, credits = $2, teacher_id = $3, semester = $4
       WHERE id = $5
       RETURNING *`,
      [subject_name, credits, teacher_id || null, semester, subjectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/subject/:subjectId
 * Delete a subject
 */
export const deleteSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const result = await pool.query(
      'DELETE FROM subjects WHERE id = $1 RETURNING *',
      [subjectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/gpa-report
 * Get GPA report for all students (student, sem, dept, gpa, cgpa)
 */
export const getGPAReport = async (req, res, next) => {
  try {
    const report = await pool.query(
      `SELECT 
        st.id as student_id,
        st.user_id,
        u.name as student_name,
        st.roll_number,
        st.semester,
        u.department,
        ROUND(SUM(CASE 
          WHEN m.total_marks >= 90 THEN 10 * su.credits
          WHEN m.total_marks >= 80 THEN 9 * su.credits
          WHEN m.total_marks >= 70 THEN 8 * su.credits
          WHEN m.total_marks >= 60 THEN 7 * su.credits
          WHEN m.total_marks >= 50 THEN 6 * su.credits
          WHEN m.total_marks >= 45 THEN 5 * su.credits
          ELSE 0
        END) / NULLIF(SUM(su.credits), 0), 2) as gpa,
        COUNT(CASE WHEN m.total_marks < 45 THEN 1 END) as failed_count,
        COUNT(m.id) as total_subjects,
        SUM(su.credits) as total_credits
       FROM students st
       JOIN users u ON st.user_id = u.id
       LEFT JOIN marks m ON st.id = m.student_id
       LEFT JOIN subjects su ON m.subject_id = su.id
       GROUP BY st.id, st.user_id, u.name, st.roll_number, st.semester, u.department
       ORDER BY u.department, st.roll_number`,
    );

    res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        total_students: report.rows.length,
        records: report.rows.map(row => ({
          ...row,
          cgpa: row.gpa, // Use GPA as CGPA for now
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/failed-students
 * Get students with failed subjects
 */
export const getFailedStudents = async (req, res, next) => {
  try {
    const failedStudents = await pool.query(
      `SELECT DISTINCT
        u.name as student_name,
        st.roll_number,
        st.semester,
        u.department,
        su.subject_code,
        su.subject_name,
        m.total_marks,
        COUNT(*) OVER (PARTITION BY st.id) as total_failed
       FROM students st
       JOIN users u ON st.user_id = u.id
       JOIN marks m ON st.id = m.student_id
       JOIN subjects su ON m.subject_id = su.id
       WHERE m.total_marks < 45
       ORDER BY u.department, st.roll_number, su.subject_code`,
    );

    res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        total_failed_records: failedStudents.rows.length,
        records: failedStudents.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/top-performers
 * Get top performing students by GPA
 */
export const getTopPerformers = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;

    const topPerformers = await pool.query(
      `SELECT 
        u.name as student_name,
        st.roll_number,
        st.semester,
        u.department,
        ROUND(SUM(CASE 
          WHEN m.total_marks >= 90 THEN 10 * su.credits
          WHEN m.total_marks >= 80 THEN 9 * su.credits
          WHEN m.total_marks >= 70 THEN 8 * su.credits
          WHEN m.total_marks >= 60 THEN 7 * su.credits
          WHEN m.total_marks >= 50 THEN 6 * su.credits
          WHEN m.total_marks >= 45 THEN 5 * su.credits
          ELSE 0
        END) / NULLIF(SUM(su.credits), 0), 2) as gpa
       FROM students st
       JOIN users u ON st.user_id = u.id
       LEFT JOIN marks m ON st.id = m.student_id
       LEFT JOIN subjects su ON m.subject_id = su.id
       GROUP BY st.id, u.name, st.roll_number, st.semester, u.department
       ORDER BY gpa DESC
       LIMIT $1`,
      [limit]
    );

    res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        limit: parseInt(limit),
        count: topPerformers.rows.length,
        records: topPerformers.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};
