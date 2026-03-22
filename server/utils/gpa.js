/**
 * GPA Calculator Utility
 * Implements Indian grading system with grade points
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
  const trimmedGrade = (grade || '').trim();
  return gradePointMap[trimmedGrade] || 0;
};

/**
 * Calculate GPA for a semester
 * GPA = Σ(Credit × Grade Point) / Σ Credits
 * 
 * @param {Array} marks - Array of mark objects with {grade, credits} or {total_marks, credits}
 * @returns {number} GPA rounded to 2 decimal places
 */
export const calculateGPA = (marks) => {
  if (!marks || marks.length === 0) return 0;

  let totalCreditsWeighted = 0;
  let totalCredits = 0;

  marks.forEach(mark => {
    let grade = mark.grade || getGradeFromMarks(mark.total_marks);
    grade = (grade || '').trim();
    const gradePoint = getGradePoint(grade);
    const credits = mark.credits || 0;

    totalCreditsWeighted += gradePoint * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? Math.round((totalCreditsWeighted / totalCredits) * 100) / 100 : 0;
};

/**
 * Calculate CGPA (Cumulative GPA) from multiple semesters
 * CGPA = Σ(GPA × Credits) / Σ Credits across all semesters
 * 
 * @param {Array} semesterData - Array of semester objects with {gpa, total_credits}
 * @returns {number} CGPA rounded to 2 decimal places
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
 * Check if a subject is failed (U grade)
 * @param {string} grade - Grade string
 * @returns {boolean}
 */
export const isFailed = (grade) => {
  return (grade || '').trim() === 'U';
};

/**
 * Get performance summary with suggestions
 * @param {Array} marks - Array of mark objects
 * @param {number} gpa - Current GPA
 * @returns {Object} Summary with recommendations
 */
export const getPerformanceSummary = (marks = [], gpa = 0) => {
  const total = marks.length;
  const failedSubjects = marks.filter(m => isFailed(m.grade)).length;
  const excellentGrades = marks.filter(m => {
    const grade = m.grade;
    return grade === 'O' || grade === 'A+';
  }).length;
  const averageGrades = marks.filter(m => {
    const grade = m.grade;
    return grade === 'A' || grade === 'B+' || grade === 'B';
  }).length;

  let summary = {
    total_subjects: total,
    failed_subjects: failedSubjects,
    excellent_count: excellentGrades,
    average_count: averageGrades,
    pass_percentage: total > 0 ? Math.round(((total - failedSubjects) / total) * 100) : 0,
    gpa: gpa,
  };

  // Generate improvement suggestions
  summary.suggestions = generateSuggestions(summary, marks);

  return summary;
};

/**
 * Generate GPA improvement suggestions based on performance
 * @param {Object} summary - Performance summary
 * @param {Array} marks - Array of mark objects
 * @returns {Array} Array of suggestion strings
 */
export const generateSuggestions = (summary, marks = []) => {
  const suggestions = [];

  if (summary.gpa >= 8.5) {
    suggestions.push('🌟 Excellent performance! Keep up the great work!');
  } else if (summary.gpa >= 7.5) {
    suggestions.push('✅ Good performance! You are on the right track.');
  } else if (summary.gpa >= 6.5) {
    suggestions.push('📈 Average performance. Try to improve your scores in next semester.');
  } else {
    suggestions.push('⚠️ Performance needs improvement.');
  }

  if (summary.failed_subjects > 0) {
    suggestions.push(`❌ You have ${summary.failed_subjects} failed subject(s). Focus on improving these areas.`);
  }

  // Find weakest subjects
  const weakSubjects = marks
    .filter(m => m.grade === 'B' || m.grade === 'C' || m.grade === 'U')
    .sort((a, b) => getGradePoint(a.grade) - getGradePoint(b.grade))
    .slice(0, 2);

  if (weakSubjects.length > 0) {
    const subjectNames = weakSubjects.map(s => s.subject_name).join(', ');
    suggestions.push(`📚 Focus on ${subjectNames} to improve your GPA.`);
  }

  if (summary.gpa < 7 && summary.gpa > 0) {
    const requiredImprovement = Math.round((7 - summary.gpa) * 10) / 10;
    suggestions.push(`💡 Aim to score ~${75 + requiredImprovement * 3}+ on average to reach 7.0 GPA.`);
  }

  if (summary.excellent_count === 0 && summary.pass_percentage === 100) {
    suggestions.push('🎯 All subjects passed! Work on academic excellence for higher GPA.');
  }

  return suggestions;
};

/**
 * Format GPA for display
 * @param {number} gpa - GPA value
 * @returns {string} Formatted GPA string
 */
export const formatGPA = (gpa) => {
  return Number.isNaN(gpa) ? '0.00' : gpa.toFixed(2);
};
