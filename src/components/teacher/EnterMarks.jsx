/**
 * Teacher - Enter Marks Page
 * Enter and update student marks
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const EnterMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    fetchMySubjects();
  }, []);

  const fetchMySubjects = async () => {
    setSubjectsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/teacher/my-subjects');
      console.log('Subjects response:', res.data);
      setSubjects(res.data.data || []);
      
      if (!res.data.data || res.data.data.length === 0) {
        setErrorMsg('No subjects assigned to you yet. Please contact admin.');
      }
    } catch (err) {
      console.error('Error loading subjects:', err);
      setErrorMsg('Failed to load subjects: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Get all students, then we'll match them with this subject
      console.log('Loading students for subject:', subject.id);
      const res = await api.get('/teacher/students');
      console.log('Students response:', res.data);
      
      const allStudents = res.data.data || [];
      if (allStudents.length === 0) {
        setErrorMsg('No students found in the system.');
        setStudents([]);
      } else {
        setStudents(allStudents);
      }
      
      // Initialize marks data
      const marks = {};
      allStudents.forEach(student => {
        marks[student.id] = { internal: 0, external: 0 };
      });
      setMarksData(marks);
    } catch (err) {
      console.error('Error loading students:', err);
      setErrorMsg('Failed to load students: ' + (err.response?.data?.error || err.message));
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = async (studentId) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const marks = marksData[studentId];
      await api.post('/teacher/marks', {
        student_id: studentId,
        subject_id: selectedSubject.id,
        internal_marks: marks.internal,
        external_marks: marks.external,
      });

      setSuccessMsg('Marks entered successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to enter marks');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px' }}>Enter Marks</h2>

      {successMsg && (
        <div style={{
          color: '#2d5016',
          background: 'rgba(55, 188, 11, 0.1)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #37bc0b',
        }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          color: '#e53e3e',
          background: 'rgba(229, 62, 62, 0.1)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #e53e3e',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Subject Selection */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ color: '#1a202c', marginBottom: '15px' }}>Select Subject</h3>
        {subjectsLoading ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>Loading your subjects...</p>
        ) : subjects.length === 0 ? (
          <div style={{
            background: 'rgba(245, 152, 62, 0.1)',
            border: '2px solid #f5983e',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#d97706'
          }}>
            <p style={{ margin: '0', fontWeight: '600' }}>No subjects assigned</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>Please contact the admin to assign you a subject.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
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
                  _hover: { borderColor: '#4FACFE' },
                }}
              >
                <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>{subject.subject_code}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', opacity: 0.9 }}>{subject.subject_name}</p>
                <p style={{ margin: '0', fontSize: '0.8em', opacity: 0.7 }}>
                  {subject.marks_entered}/{subject.enrolled_students} marked
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marks Entry Table */}
      {selectedSubject && (
        <div>
          <h3 style={{ color: '#1a202c', marginBottom: '15px' }}>
            {selectedSubject.subject_code} - {selectedSubject.subject_name}
          </h3>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>Loading students...</p>
          ) : students.length === 0 ? (
            <div style={{
              background: 'rgba(245, 152, 62, 0.1)',
              border: '2px solid #f5983e',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              color: '#d97706'
            }}>
              <p style={{ margin: '0', fontSize: '1.1em', fontWeight: '600' }}>No students found</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.9em' }}>There are no students in the system yet. Please ask admin to create student accounts.</p>
            </div>
          ) : (
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
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Roll Number</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Internal (40)</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>External (60)</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Total</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const marks = marksData[student.id] || { internal: 0, external: 0 };
                    const total = marks.internal + marks.external;
                    return (
                      <tr key={student.id} style={{ borderTop: '1px solid #CBD5E1' }}>
                        <td style={{ padding: '15px', color: '#1a202c', fontWeight: '600' }}>{student.name}</td>
                        <td style={{ padding: '15px', color: '#718096' }}>{student.roll_number}</td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={marks.internal}
                            onChange={(e) => handleMarksChange(student.id, 'internal', e.target.value)}
                            style={{
                              width: '70px',
                              padding: '8px',
                              border: '2px solid #CBD5E1',
                              borderRadius: '6px',
                              textAlign: 'center',
                            }}
                          />
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={marks.external}
                            onChange={(e) => handleMarksChange(student.id, 'external', e.target.value)}
                            style={{
                              width: '70px',
                              padding: '8px',
                              border: '2px solid #CBD5E1',
                              borderRadius: '6px',
                              textAlign: 'center',
                            }}
                          />
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c', fontWeight: '600' }}>
                          {total}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleSubmit(student.id)}
                            style={{
                              padding: '8px 15px',
                              background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.9em',
                            }}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnterMarks;
