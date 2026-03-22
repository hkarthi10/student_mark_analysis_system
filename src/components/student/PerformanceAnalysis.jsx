/**
 * Student - Performance Analysis Page
 * Detailed performance metrics, trends, and improvement suggestions
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const PerformanceAnalysis = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/student/performance');
      setPerformance(res.data.data);
    } catch (err) {
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colorMap = {
      'O': '#06b6d4',
      'A+': '#22863a',
      'A': '#28a745',
      'B+': '#0366d6',
      'B': '#6f42c1',
      'C': '#f6ad55',
      'U': '#d73a49',
    };
    return colorMap[grade] || '#718096';
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px', fontSize: '2em', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Performance Analysis</h2>

      {error && (
        <div style={{
          color: '#e53e3e',
          background: 'rgba(229, 62, 62, 0.1)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #e53e3e',
          fontSize: '0.95em'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#718096' }}>Loading analysis...</p>
      ) : performance ? (
        <>
          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Total Subjects</p>
              <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
                {performance.performance_summary.total_subjects}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Total Credits</p>
              <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
                {performance.subject_performance.reduce((sum, subj) => sum + (subj.credits || 0), 0)}
              </h3>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
            }}>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9, fontSize: '0.9em' }}>Average Marks</p>
              <h3 style={{ margin: '0', fontSize: '2.5em', fontWeight: '700' }}>
                {performance.performance_summary.average_marks}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Highest Score</p>
              <h3 style={{ color: '#22863a', margin: '0', fontSize: '2.2em', fontWeight: '700' }}>
                {performance.performance_summary.highest_score}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Lowest Score</p>
              <h3 style={{ color: '#e53e3e', margin: '0', fontSize: '2.2em', fontWeight: '700' }}>
                {performance.performance_summary.lowest_score}
              </h3>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9, fontSize: '0.9em' }}>GPA</p>
              <h3 style={{ margin: '0', fontSize: '2.5em', fontWeight: '700' }}>
                {performance.performance_summary.gpa.toFixed(2)}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Pass %</p>
              <h3 style={{ color: '#22863a', margin: '0', fontSize: '2.2em', fontWeight: '700' }}>
                {performance.performance_summary.pass_percentage}%
              </h3>
            </div>

            <div style={{
              background: performance.performance_summary.failed_subjects > 0 ? '#fee8e8' : '#f0f8ff',
              padding: '20px',
              borderRadius: '12px',
              border: `2px solid ${performance.performance_summary.failed_subjects > 0 ? '#d73a49' : '#0366d6'}`,
            }}>
              <p style={{ 
                color: '#718096', 
                margin: '0 0 10px 0',
                fontSize: '0.9em',
              }}>
                Failed Subjects
              </p>
              <h3 style={{ 
                color: performance.performance_summary.failed_subjects > 0 ? '#d73a49' : '#22863a',
                margin: '0', 
                fontSize: '2.2em', 
                fontWeight: '700' 
              }}>
                {performance.performance_summary.failed_subjects}
              </h3>
            </div>
          </div>

          {/* Grade Distribution */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#1a202c', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>Grade Distribution</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '12px',
            }}>
              {performance.grade_distribution.map((gradeData) => (
                gradeData.count > 0 && (
                  <div
                    key={gradeData.grade}
                    style={{
                      background: getGradeColor(gradeData.grade),
                      color: 'white',
                      padding: '15px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 8px 0', fontSize: '0.9em' }}>
                      Grade {gradeData.grade}
                    </p>
                    <h3 style={{ color: 'white', margin: '0', fontSize: '1.8em', fontWeight: '700' }}>
                      {gradeData.count}
                    </h3>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Semester-wise GPA */}
          {performance.semesters && performance.semesters.length > 0 && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              marginBottom: '25px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <h3 style={{ color: '#1a202c', marginTop: '0', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>GPA by Semester</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #CBD5E1' }}>
                      <th style={{ padding: '10px', textAlign: 'left', color: '#1a202c', fontWeight: '600' }}>
                        Semester
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                        Subjects
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                        Credits
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                        GPA
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                        Failed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.semesters.map((sem) => (
                      <tr key={sem.semester} style={{ borderBottom: '1px solid #CBD5E1' }}>
                        <td style={{ padding: '10px', color: '#1a202c', fontWeight: '600' }}>
                          Semester {sem.semester}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#718096' }}>
                          {sem.total_subjects || 0}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#718096' }}>
                          {sem.total_credits || 0}
                        </td>
                        <td style={{
                          padding: '10px',
                          textAlign: 'center',
                          fontWeight: '600',
                          background: sem.gpa >= 9 ? '#22863a' : sem.gpa >= 7 ? '#0366d6' : sem.gpa >= 5 ? '#f6ad55' : '#d73a49',
                          color: 'white',
                        }}>
                          {sem.gpa !== null && sem.gpa !== undefined ? parseFloat(sem.gpa).toFixed(2) : '0.00'}
                        </td>
                        <td style={{
                          padding: '10px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: (sem.failed_count || 0) > 0 ? '#d73a49' : '#22863a',
                        }}>
                          {sem.failed_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Improvement Suggestions */}
          {performance.performance_summary.suggestions && performance.performance_summary.suggestions.length > 0 && (
            <div style={{
              background: '#f0f8ff',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #0366d6',
              marginBottom: '25px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}>
              <h3 style={{ color: '#0366d6', marginTop: '0', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>Suggestions for Improvement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {performance.performance_summary.suggestions.map((suggestion, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'white',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0366d6',
                      color: '#1a202c',
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Performance */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1a202c', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>Subject Performance</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}>
                <thead style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Subject Code</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Subject Name</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Marks</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Grade</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Grade Point</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.subject_performance.map((subject, idx) => (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderTop: '1px solid #CBD5E1',
                        background: subject.total_marks < 45 ? '#fef2f2' : 'transparent',
                      }}
                    >
                      <td style={{ 
                        padding: '15px', 
                        color: '#1a202c', 
                        fontWeight: '600',
                        borderLeft: subject.total_marks < 45 ? '4px solid #d73a49' : 'none',
                        paddingLeft: subject.total_marks < 45 ? '11px' : '15px',
                      }}>
                        {subject.subject_code}
                      </td>
                      <td style={{ padding: '15px', color: '#1a202c' }}>
                        {subject.subject_name}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                        {subject.total_marks}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: 'white',
                        background: getGradeColor(subject.grade),
                        fontWeight: '600',
                        borderRadius: '6px',
                        margin: '5px',
                      }}>
                        {subject.grade}
                      </td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'center', 
                        color: '#1a202c',
                        fontWeight: '600',
                      }}>
                        {subject.grade_point}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#718096' }}>
                        {subject.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grading Reference */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <h3 style={{ color: '#1a202c', marginTop: '0', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>Grading Scale Reference</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '10px',
            }}>
              {[
                { grade: 'O', range: '90-100', point: 10 },
                { grade: 'A+', range: '80-89', point: 9 },
                { grade: 'A', range: '70-79', point: 8 },
                { grade: 'B+', range: '60-69', point: 7 },
                { grade: 'B', range: '50-59', point: 6 },
                { grade: 'C', range: '45-49', point: 5 },
                { grade: 'U', range: 'Below 45', point: 0 },
              ].map((item) => (
                <div 
                  key={item.grade}
                  style={{
                    padding: '12px',
                    background: getGradeColor(item.grade),
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                  }}
                >
                  <p style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{item.grade}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.85em', opacity: 0.9 }}>{item.range}</p>
                  <p style={{ margin: '0', fontSize: '0.9em', opacity: 0.8 }}>GP: {item.point}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PerformanceAnalysis;
