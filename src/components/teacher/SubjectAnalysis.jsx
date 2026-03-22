/**
 * Teacher - Subject Analysis Page
 * View analysis for subjects they teach
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const SubjectAnalysis = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teacher/my-subjects');
      setSubjects(res.data.data);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    try {
      const res = await api.get(`/teacher/subject-analysis/${subject.id}`);
      setAnalysis(res.data.data);
    } catch (err) {
      console.error('Failed to load analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px' }}>Subject Analysis</h2>

      {/* Subject Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        {subjects.map(subject => (
          <div
            key={subject.id}
            onClick={() => handleSubjectSelect(subject)}
            style={{
              padding: '15px',
              background: selectedSubject?.id === subject.id
                ? 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)'
                : 'white',
              color: selectedSubject?.id === subject.id ? 'white' : '#1a202c',
              border: '2px solid #CBD5E1',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>{subject.subject_code}</p>
            <p style={{ margin: '0', fontSize: '0.9em', opacity: 0.9 }}>{subject.subject_name}</p>
          </div>
        ))}
      </div>

      {/* Analysis */}
      {selectedSubject && analysis && (
        <div>
          <h3 style={{ color: '#1a202c', marginBottom: '20px' }}>
            {analysis.subject.subject_code} - {analysis.subject.subject_name}
          </h3>

          {/* Stats Cards */}
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
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Total Students</p>
              <h3 style={{ color: '#1a202c', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.total_students}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Class Average</p>
              <h3 style={{ color: '#1a202c', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.class_average}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Highest Score</p>
              <h3 style={{ color: '#22863a', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.highest_marks}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Lowest Score</p>
              <h3 style={{ color: '#e53e3e', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.lowest_marks}
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Pass %</p>
              <h3 style={{ color: '#22863a', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.pass_percentage}%
              </h3>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
            }}>
              <p style={{ color: '#718096', margin: '0 0 10px 0' }}>Failed</p>
              <h3 style={{ color: '#e53e3e', margin: '0', fontSize: '1.8em' }}>
                {analysis.analysis.fail_count}
              </h3>
            </div>
          </div>

          {/* Topper */}
          {analysis.topper && (
            <div style={{
              background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px',
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>🏆 Class Topper</h4>
              <p style={{ margin: '0 0 5px 0', fontSize: '1.1em', fontWeight: '600' }}>
                {analysis.topper.name}
              </p>
              <p style={{ margin: '0', opacity: 0.9 }}>
                {analysis.topper.roll_number} - {analysis.topper.total_marks} marks ({analysis.topper.grade})
              </p>
            </div>
          )}

          {/* Arrear List */}
          {analysis.arrear_list.length > 0 && (
            <div>
              <h4 style={{ color: '#e53e3e', marginBottom: '15px' }}>Students in Arrear</h4>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '2px solid #CBD5E1',
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#fee' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#e53e3e' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#e53e3e' }}>Roll No</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#e53e3e' }}>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.arrear_list.map((student, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #CBD5E1' }}>
                        <td style={{ padding: '12px', color: '#1a202c' }}>{student.name}</td>
                        <td style={{ padding: '12px', color: '#718096' }}>{student.roll_number}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#e53e3e', fontWeight: '600' }}>
                          {student.total_marks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <p style={{ textAlign: 'center', color: '#718096' }}>Loading analysis...</p>}
    </div>
  );
};

export default SubjectAnalysis;
