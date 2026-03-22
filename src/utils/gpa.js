/**
 * GPA Calculator Frontend Utility
 * Implements Indian grading system with grade points
 * Mirror of backend GPA utility for frontend use
 */

/**
 * Convert marks to grade based on grading logic
 * 90-100 → O (10)
 * 80-89 → A+ (9)
 * 70-79 → A (8)
 * 60-69 → B+ (7)
 * 50-59 → B (6)
 * 45-49 → C (5)
 * Below 45 → U (0, fail)
 */
export const getGradeFromMarks = (marks) => {
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  if (marks >= 45) return 'C';
  return 'U';
};

/**
 * Get grade point value for a grade
 */
export const getGradePoint = (grade) => {
  const gradePointMap = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'U': 0,
  };
  return gradePointMap[grade] || 0;
};

/**
 * Calculate GPA for a semester
 * GPA = Σ(Credit × Grade Point) / Σ Credits
 */
export const calculateGPA = (marks) => {
  if (!marks || marks.length === 0) return 0;

  let totalCreditsWeighted = 0;
  let totalCredits = 0;

  marks.forEach(mark => {
    const grade = mark.grade || getGradeFromMarks(mark.total_marks);
    const gradePoint = getGradePoint(grade);
    const credits = mark.credits || 0;

    totalCreditsWeighted += gradePoint * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? Math.round((totalCreditsWeighted / totalCredits) * 100) / 100 : 0;
};

/**
 * Calculate CGPA (Cumulative GPA) from multiple semesters
 */
export const calculateCGPA = (semesterData) => {
  if (!semesterData || semesterData.length === 0) return 0;

  let totalCreditsWeighted = 0;
  let totalCredits = 0;

  semesterData.forEach(semester => {
    const gpa = semester.gpa || 0;
    const credits = semester.total_credits || 0;

    totalCreditsWeighted += gpa * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? Math.round((totalCreditsWeighted / totalCredits) * 100) / 100 : 0;
};

/**
 * Check if a subject is failed (U grade or marks < 45)
 */
export const isFailed = (marks) => {
  return marks < 45 || getGradeFromMarks(marks) === 'U';
};

/**
 * Format GPA for display
 */
export const formatGPA = (gpa) => {
  return Number.isNaN(gpa) ? '0.00' : gpa.toFixed(2);
};

/**
 * Get GPA category/performance level
 */
export const getGPACategory = (gpa) => {
  if (gpa >= 9) return 'Outstanding';
  if (gpa >= 8) return 'Excellent';
  if (gpa >= 7) return 'Very Good';
  if (gpa >= 6) return 'Good';
  if (gpa >= 5) return 'Average';
  return 'Below Average';
};

/**
 * Grading scale reference
 */
export const GRADING_SCALE = [
  { grade: 'O', range: '90-100', point: 10, color: '#06b6d4' },
  { grade: 'A+', range: '80-89', point: 9, color: '#22863a' },
  { grade: 'A', range: '70-79', point: 8, color: '#28a745' },
  { grade: 'B+', range: '60-69', point: 7, color: '#0366d6' },
  { grade: 'B', range: '50-59', point: 6, color: '#6f42c1' },
  { grade: 'C', range: '45-49', point: 5, color: '#f6ad55' },
  { grade: 'U', range: 'Below 45', point: 0, color: '#d73a49' },
];
