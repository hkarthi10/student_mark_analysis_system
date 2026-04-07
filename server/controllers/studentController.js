/**
 * Student Controller
 * Handles student marksheet, performance analysis, and reports
 */

import pool from '../config/database.js';
import { calculateGPA, calculateCGPA, getPerformanceSummary, getGradeFromMarks } from '../utils/gpa.js';

/**
 * GET /api/student/marks
 * Get marksheet for logged-in student
 */
export const getMyMarks = async (req, res, next) => {
  try {
    // Get student ID from user_id
    const studentResult = await pool.query(
      'SELECT id, semester FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student record not found.',
      });
    }

    const student = studentResult.rows[0];
    const studentId = student.id;
    const currentSemester = student.semester;

    // Get all marks for this student in current semester
    const marksResult = await pool.query(
      `SELECT 
        m.id,
        su.subject_code,
        su.subject_name,
        su.credits,
        su.department,
        m.internal_marks,
        m.external_marks,
        m.total_marks,
        m.grade,
        u.name as teacher_name
       FROM marks m
       JOIN subjects su ON m.subject_id = su.id
       JOIN teachers t ON su.teacher_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE m.student_id = $1
       ORDER BY su.subject_code`,
      [studentId]
    );

    // Calculate GPA for current semester
    const marks = marksResult.rows;
    
    // **IMPORTANT**: Always recalculate grade from total_marks to ensure consistency with Anna University system
    // This fixes any historical data that may have incorrect grades from older versions
    const enrichedMarks = marks.map(m => ({
      ...m,
      grade: getGradeFromMarks(m.total_marks),
    }));
    
    const totalCredits = marks.reduce((sum, m) => sum + m.credits, 0);
    const totalMarks = marks.reduce((sum, m) => sum + m.total_marks, 0);
    const averageMarks = marks.length > 0 ? (totalMarks / marks.length).toFixed(2) : 0;
    const gpa = calculateGPA(enrichedMarks);
    
    // For CGPA: If student only has current semester, CGPA = GPA
    // If student has historical data, calculate from all semesters
    const cgpa = gpa; // TODO: Calculate from historical semesters if available
    const failedSubjects = marks.filter(m => m.total_marks < 45).length;

    // Add gradePoint to each enriched mark for frontend display
    const finalMarks = enrichedMarks.map(m => ({
      ...m,
      grade_point: m.total_marks >= 90 ? 10 : 
                   m.total_marks >= 80 ? 9 :
                   m.total_marks >= 70 ? 8 :
                   m.total_marks >= 60 ? 7 :
                   m.total_marks >= 50 ? 6 :
                   m.total_marks >= 45 ? 5 : 0
    }));

    // Prepare semester data for frontend
    const semesterData = {
      semester: currentSemester,
      total_subjects: marks.length,
      gpa: parseFloat(gpa),
      total_credits: totalCredits,
      failed_count: failedSubjects,
    };

    res.status(200).json({
      success: true,
      data: {
        marksheet: finalMarks,
        summary: {
          total_subjects: marks.length,
          total_credits: totalCredits,
          average_marks: parseFloat(averageMarks),
          gpa: parseFloat(gpa),
          cgpa: parseFloat(cgpa),
          failed_subjects: failedSubjects,
          pass_percentage: marks.length > 0 
            ? parseFloat((((marks.length - failedSubjects) / marks.length) * 100).toFixed(2))
            : 0,
        },
        semesters: [semesterData],
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/student/performance
 * Get performance analysis for the student
 */
export const getPerformanceAnalysis = async (req, res, next) => {
  try {
    // Get student ID
    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student record not found.',
      });
    }

    const studentId = studentResult.rows[0].id;

    // Get marks and performance metrics
    const performanceResult = await pool.query(
      `SELECT 
        COUNT(*) as total_subjects,
        ROUND(AVG(m.total_marks), 2) as average_marks,
        MAX(m.total_marks) as highest_score,
        MIN(m.total_marks) as lowest_score,
        COUNT(CASE WHEN m.total_marks >= 90 THEN 1 END) as o_grade_count,
        COUNT(CASE WHEN m.total_marks >= 80 AND m.total_marks < 90 THEN 1 END) as a_plus_count,
        COUNT(CASE WHEN m.total_marks >= 70 AND m.total_marks < 80 THEN 1 END) as a_grade_count,
        COUNT(CASE WHEN m.total_marks >= 60 AND m.total_marks < 70 THEN 1 END) as b_plus_count,
        COUNT(CASE WHEN m.total_marks >= 50 AND m.total_marks < 60 THEN 1 END) as b_grade_count,
        COUNT(CASE WHEN m.total_marks >= 45 AND m.total_marks < 50 THEN 1 END) as c_grade_count,
        COUNT(CASE WHEN m.total_marks < 45 THEN 1 END) as u_grade_count,
        ROUND(100.0 * COUNT(CASE WHEN m.total_marks >= 45 THEN 1 END) / NULLIF(COUNT(*), 0), 2) as pass_percentage
       FROM marks m
       WHERE m.student_id = $1`,
      [studentId]
    );

    // Get marks for GPA and performance data (including semester info)
    const marksData = await pool.query(
      `SELECT 
        su.subject_code,
        su.subject_name,
        m.total_marks,
        su.credits,
        su.semester
       FROM marks m
       JOIN subjects su ON m.subject_id = su.id
       WHERE m.student_id = $1
       ORDER BY su.semester, m.total_marks DESC`,
      [studentId]
    );

    const analysis = performanceResult.rows[0];
    const marksArray = marksData.rows.map(m => ({
      ...m,
      grade: getGradeFromMarks(m.total_marks),
      grade_point: m.total_marks >= 90 ? 10 :
                   m.total_marks >= 80 ? 9 :
                   m.total_marks >= 70 ? 8 :
                   m.total_marks >= 60 ? 7 :
                   m.total_marks >= 50 ? 6 :
                   m.total_marks >= 45 ? 5 : 0
    }));

    // Calculate semester-wise GPA using same method as main GPA
    const semesterMap = {};
    marksArray.forEach(mark => {
      if (!semesterMap[mark.semester]) {
        semesterMap[mark.semester] = [];
      }
      semesterMap[mark.semester].push(mark);
    });

    const semesterData = Object.keys(semesterMap).map(semNum => {
      const semMarks = semesterMap[semNum];
      const semGPA = calculateGPA(semMarks);
      const totalCredits = semMarks.reduce((sum, m) => sum + (m.credits || 0), 0);
      const failedCount = semMarks.filter(m => m.total_marks < 45).length;
      
      return {
        semester: parseInt(semNum),
        total_subjects: semMarks.length,
        gpa: parseFloat(semGPA),
        total_credits: totalCredits,
        failed_count: failedCount,
      };
    }).sort((a, b) => a.semester - b.semester);

    const gpa = calculateGPA(marksArray);
    const performanceSummary = getPerformanceSummary(marksArray, gpa);

    res.status(200).json({
      success: true,
      data: {
        performance_summary: {
          total_subjects: parseInt(analysis.total_subjects),
          average_marks: parseFloat(analysis.average_marks) || 0,
          highest_score: analysis.highest_score,
          lowest_score: analysis.lowest_score,
          gpa: gpa,
          pass_percentage: parseFloat(analysis.pass_percentage) || 0,
          failed_subjects: parseInt(analysis.u_grade_count),
          suggestions: performanceSummary.suggestions,
        },
        grade_distribution: [
          { grade: 'O', count: parseInt(analysis.o_grade_count) },
          { grade: 'A+', count: parseInt(analysis.a_plus_count) },
          { grade: 'A', count: parseInt(analysis.a_grade_count) },
          { grade: 'B+', count: parseInt(analysis.b_plus_count) },
          { grade: 'B', count: parseInt(analysis.b_grade_count) },
          { grade: 'C', count: parseInt(analysis.c_grade_count) },
          { grade: 'U', count: parseInt(analysis.u_grade_count) },
        ],
        semesters: semesterData,
        subject_performance: marksArray,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/student/report
 * Get downloadable report for the student
 */
export const getStudentReport = async (req, res, next) => {
  try {
    // Get student details
    const studentResult = await pool.query(
      `SELECT 
        u.name,
        u.email,
        u.department,
        st.roll_number,
        st.semester,
        st.id
       FROM students st
       JOIN users u ON st.user_id = u.id
       WHERE st.user_id = $1`,
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student record not found.',
      });
    }

    const student = studentResult.rows[0];

    // Get marks
    const marksResult = await pool.query(
      `SELECT 
        su.subject_code,
        su.subject_name,
        su.credits,
        m.internal_marks,
        m.external_marks,
        m.total_marks
       FROM marks m
       JOIN subjects su ON m.subject_id = su.id
       WHERE m.student_id = $1
       ORDER BY su.subject_code`,
      [student.id]
    );

    const marks = marksResult.rows;
    
    // Enrich with grades
    const enrichedMarks = marks.map(m => ({
      ...m,
      grade: getGradeFromMarks(m.total_marks),
      grade_point: m.total_marks >= 90 ? 10 :
                   m.total_marks >= 80 ? 9 :
                   m.total_marks >= 70 ? 8 :
                   m.total_marks >= 60 ? 7 :
                   m.total_marks >= 50 ? 6 :
                   m.total_marks >= 45 ? 5 : 0
    }));

    const totalCredits = marks.reduce((sum, m) => sum + m.credits, 0);
    const totalMarks = marks.reduce((sum, m) => sum + m.total_marks, 0);
    const gpa = calculateGPA(enrichedMarks);
    const failedSubjects = marks.filter(m => m.total_marks < 45).length;

    res.status(200).json({
      success: true,
      data: {
        generated_at: new Date().toISOString(),
        student_info: {
          name: student.name,
          email: student.email,
          roll_number: student.roll_number,
          department: student.department,
          semester: student.semester,
        },
        marksheet: enrichedMarks,
        summary: {
          total_subjects: marks.length,
          total_credits: totalCredits,
          total_marks_obtained: totalMarks,
          average_marks: marks.length > 0 ? (totalMarks / marks.length).toFixed(2) : 0,
          gpa: gpa.toFixed(2),
          pass_percentage: marks.length > 0 
            ? (((marks.length - failedSubjects) / marks.length) * 100).toFixed(2)
            : 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/student/cgpa
 * Get CGPA data for all semesters
 */
export const getCGPA = async (req, res, next) => {
  try {
    // Get student ID
    const studentResult = await pool.query(
      'SELECT id, semester FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student record not found.',
      });
    }

    const studentId = studentResult.rows[0].id;

    // Get GPA for all semesters
    const semesterDataResult = await pool.query(
      `SELECT 
        st.semester,
        COALESCE(COUNT(m.id), 0) as total_subjects,
        COALESCE(ROUND(SUM(CASE 
          WHEN m.total_marks >= 90 THEN 10 * su.credits
          WHEN m.total_marks >= 80 THEN 9 * su.credits
          WHEN m.total_marks >= 70 THEN 8 * su.credits
          WHEN m.total_marks >= 60 THEN 7 * su.credits
          WHEN m.total_marks >= 50 THEN 6 * su.credits
          WHEN m.total_marks >= 45 THEN 5 * su.credits
          ELSE 0
        END) / NULLIF(SUM(su.credits), 0), 2), 0) as gpa,
        COALESCE(SUM(su.credits), 0) as total_credits,
        COALESCE(COUNT(CASE WHEN m.total_marks < 45 THEN 1 END), 0) as failed_count
       FROM students st
       LEFT JOIN marks m ON st.id = m.student_id
       LEFT JOIN subjects su ON m.subject_id = su.id
       WHERE st.id = $1
       GROUP BY st.semester
       ORDER BY st.semester`,
      [studentId]
    );

    const semesterData = semesterDataResult.rows.map(row => ({
      ...row,
      gpa: parseFloat(row.gpa) || 0,
      total_credits: parseInt(row.total_credits) || 0,
      total_subjects: parseInt(row.total_subjects) || 0,
      failed_count: parseInt(row.failed_count) || 0,
    }));
    const cgpa = calculateCGPA(semesterData);

    res.status(200).json({
      success: true,
      data: {
        semesters: semesterData,
        cgpa: cgpa,
      },
    });
  } catch (err) {
    next(err);
  }
};
