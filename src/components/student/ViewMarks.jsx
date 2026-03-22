/**
 * Student - View Marks Page
 * Display student's marksheet and grades with new GPA system
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const ViewMarks = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/student/marks');
      setMarksheet(res.data.data.marksheet);
      setSummary(res.data.data.summary);
    } catch (err) {
      setError('Failed to load marksheet');
      console.error('Error fetching marks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colorMap = {
      'O': '#06b6d4',   // Cyan
      'A+': '#22863a',  // Green
      'A': '#28a745',   // Light Green
      'B+': '#0366d6',  // Blue
      'B': '#6f42c1',   // Purple
      'C': '#f6ad55',   // Orange
      'U': '#d73a49',   // Red (Failed)
    };
    return colorMap[grade] || '#718096';
  };

  const getGradePointColor = (gradePoint) => {
    if (gradePoint >= 9) return '#22863a';
    if (gradePoint >= 7) return '#0366d6';
    if (gradePoint >= 5) return '#f6ad55';
    return '#d73a49';
  };

  const isFailed = (mark) => mark.total_marks < 45;

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px', fontSize: '2em', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Marksheet</h2>

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
        <p style={{ textAlign: 'center', color: '#718096' }}>Loading marksheet...</p>
      ) : (
        <>
          {/* Marksheet Table */}
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
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
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Internal</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>External</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Credits</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Grade</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {marksheet && marksheet.length > 0 ? marksheet.map((mark) => (
                  <tr 
                    key={mark.id} 
                    style={{ 
                      borderTop: '1px solid #CBD5E1',
                      background: isFailed(mark) ? '#fef2f2' : 'transparent',
                    }}
                  >
                    <td style={{ 
                      padding: '15px', 
                      color: '#1a202c', 
                      fontWeight: '600',
                      borderLeft: isFailed(mark) ? '4px solid #d73a49' : 'none',
                      paddingLeft: isFailed(mark) ? '11px' : '15px',
                    }}>
                      {mark.subject_code}
                    </td>
                    <td style={{ padding: '15px', color: '#1a202c' }}>
                      {mark.subject_name}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#718096' }}>
                      {mark.internal_marks}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#718096' }}>
                      {mark.external_marks}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center', 
                      color: '#1a202c', 
                      fontWeight: '600' 
                    }}>
                      {mark.total_marks}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#718096' }}>
                      {mark.credits}
                    </td>
                    <td style={{
                      padding: '15px',
                      textAlign: 'center',
                      color: 'white',
                      background: getGradeColor(mark.grade),
                      fontWeight: '600',
                    }}>
                      {mark.grade}
                    </td>
                    <td style={{
                      padding: '15px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: 'white',
                      background: getGradePointColor(mark.grade_point),
                    }}>
                      {mark.grade_point}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                      No marks entered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grading Scale Reference */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <h3 style={{ color: '#1a202c', marginTop: '0', marginBottom: '15px', fontSize: '1.1em', fontWeight: '600' }}>Grading Scale</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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

          {marksheet.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
              <p>No marks entered yet. Check back soon!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewMarks;
