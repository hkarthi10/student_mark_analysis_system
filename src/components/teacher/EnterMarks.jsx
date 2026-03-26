/**
 * Teacher - Enter Marks Page
 * Search & select students, enter and save marks in batch
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const EnterMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [marksData, setMarksData] = useState({});
  const [marksMode, setMarksMode] = useState(false); // false: selection, true: marks entry
  const [loading, setLoading] = useState(false);
  const [savingMarks, setSavingMarks] = useState(false);
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
    setSearchTerm('');
    setSelectedStudents(new Set());
    setMarksMode(false);
    
    try {
      const res = await api.get('/teacher/students');
      console.log('Students response:', res.data);
      
      const allStudentsList = res.data.data || [];
      if (allStudentsList.length === 0) {
        setErrorMsg('No students found in the system.');
        setAllStudents([]);
      } else {
        setAllStudents(allStudentsList);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setErrorMsg('Failed to load students: ' + (err.response?.data?.error || err.message));
      setAllStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter students by search term
  const filteredStudents = allStudents.filter(student =>
    student.register_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
        // Also remove from marksData
        const newMarksData = { ...marksData };
        delete newMarksData[studentId];
        setMarksData(newMarksData);
      } else {
        newSet.add(studentId);
        // Initialize marks for this student
        setMarksData(prev => ({
          ...prev,
          [studentId]: { internal: 0, external: 0 },
        }));
      }
      return newSet;
    });
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

  const handleProceedToMarks = () => {
    if (selectedStudents.size === 0) {
      setErrorMsg('Please select at least one student');
      return;
    }
    setMarksMode(true);
    setErrorMsg('');
  };

  const handleGoBack = () => {
    setMarksMode(false);
    setErrorMsg('');
  };

  const handleSaveAllMarks = async () => {
    setSavingMarks(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const marksToSave = Array.from(selectedStudents).map(studentId => ({
        student_id: studentId,
        subject_id: selectedSubject.id,
        internal_marks: marksData[studentId].internal,
        external_marks: marksData[studentId].external,
      }));

      // Save all marks
      for (const mark of marksToSave) {
        await api.post('/teacher/marks', mark);
      }

      setSuccessMsg(`Marks saved successfully for ${marksToSave.length} student(s)!`);
      setTimeout(() => {
        setSuccessMsg('');
        setMarksMode(false);
        setSelectedStudents(new Set());
        setMarksData({});
        setSearchTerm('');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save marks');
    } finally {
      setSavingMarks(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto',
    }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
        Enter Marks
      </h2>

      {successMsg && (
        <div style={{
          color: '#2d5016',
          background: 'rgba(55, 188, 11, 0.1)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #37bc0b',
          animation: 'slideIn 0.3s ease-out',
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
          animation: 'slideIn 0.3s ease-out',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Subject Selection */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ color: '#1a202c', marginBottom: '15px', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>
          Select Subject
        </h3>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px',
            '@media (max-width: 768px)': {
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            }
          }}>
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
                <p style={{ margin: '0 0 5px 0', fontWeight: '600', fontSize: '0.95em' }}>
                  {subject.subject_code}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.85em', opacity: 0.9 }}>
                  {subject.subject_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Selection Mode */}
      {selectedSubject && !marksMode && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e0e0e0',
        }}>
          <h3 style={{ color: '#1a202c', marginBottom: '15px', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
            {selectedSubject.subject_code} - {selectedSubject.subject_name}
          </h3>
          <p style={{ color: '#718096', marginBottom: '20px', fontSize: '0.9em' }}>
            Search and select students by register number
          </p>

          {/* Search Bar */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by register number, roll number, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '1em',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4FACFE';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
              Loading students...
            </p>
          ) : allStudents.length === 0 ? (
            <div style={{
              background: 'rgba(245, 152, 62, 0.1)',
              border: '2px solid #f5983e',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
              color: '#d97706'
            }}>
              <p style={{ margin: '0', fontSize: '1em', fontWeight: '600' }}>
                No students found
              </p>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.85em' }}>
                There are no students in the system yet
              </p>
            </div>
          ) : (
            <>
              {/* Selected Students Count */}
              <div style={{
                background: '#e3f2fd',
                padding: '12px 15px',
                borderRadius: '6px',
                marginBottom: '20px',
                color: '#1565c0',
                fontWeight: '600',
                fontSize: '0.9em',
                textAlign: 'center',
              }}>
                {selectedStudents.size > 0 
                  ? `${selectedStudents.size} student${selectedStudents.size !== 1 ? 's' : ''} selected`
                  : 'No students selected'
                }
              </div>

              {/* Students List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
              }}>
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student.id)}
                    style={{
                      padding: '15px',
                      background: selectedStudents.has(student.id) ? '#e3f2fd' : 'white',
                      border: selectedStudents.has(student.id)
                        ? '2px solid #4FACFE'
                        : '2px solid #CBD5E1',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStudentSelect(student.id);
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#4FACFE',
                      }}
                    />
                    <div>
                      <p style={{ margin: '0', fontWeight: '600', color: '#1a202c', fontSize: '0.95em' }}>
                        {student.name}
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '0.85em' }}>
                        Reg: {student.register_number || student.roll_number}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#718096',
                  padding: '30px',
                  fontSize: '0.9em',
                }}>
                  No students found matching "{searchTerm}"
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={handleProceedToMarks}
                  disabled={selectedStudents.size === 0 || loading}
                  style={{
                    padding: '12px 30px',
                    background: selectedStudents.size === 0
                      ? '#cccccc'
                      : 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: selectedStudents.size === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95em',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                  }}
                >
                  Enter Marks ({selectedStudents.size})
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Marks Entry Mode */}
      {selectedSubject && marksMode && selectedStudents.size > 0 && (
        <div style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e0e0e0',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <h3 style={{
              color: '#1a202c',
              margin: '0',
              fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            }}>
              Enter Marks - {selectedSubject.subject_code}
            </h3>
            <button
              onClick={handleGoBack}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#4FACFE',
                border: '2px solid #4FACFE',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9em',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f6ff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              ← Back & Modify
            </button>
          </div>

          {/* Marks Entry Form */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
          }}>
            {Array.from(selectedStudents).map(studentId => {
              const student = allStudents.find(s => s.id === studentId);
              const marks = marksData[studentId] || { internal: 0, external: 0 };
              const total = marks.internal + marks.external;

              return (
                <div
                  key={studentId}
                  style={{
                    background: 'white',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div>
                    <p style={{
                      margin: '0',
                      fontWeight: '600',
                      color: '#1a202c',
                      fontSize: '0.95em',
                    }}>
                      {student?.name}
                    </p>
                    <p style={{
                      margin: '4px 0 0 0',
                      color: '#718096',
                      fontSize: '0.85em',
                    }}>
                      Reg: {student?.register_number || student?.roll_number}
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85em',
                      color: '#4a5568',
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}>
                      Internal Marks (0-40)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={marks.internal}
                      onChange={(e) => handleMarksChange(studentId, 'internal', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '1em',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85em',
                      color: '#4a5568',
                      marginBottom: '6px',
                      fontWeight: '600',
                    }}>
                      External Marks (0-60)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={marks.external}
                      onChange={(e) => handleMarksChange(studentId, 'external', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '1em',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{
                    background: '#f0f6ff',
                    padding: '10px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      margin: '0',
                      color: '#1565c0',
                      fontWeight: '600',
                      fontSize: '0.95em',
                    }}>
                      Total: {total}/100
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save All Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={handleSaveAllMarks}
              disabled={savingMarks}
              style={{
                padding: '12px 40px',
                background: savingMarks
                  ? '#cccccc'
                  : 'linear-gradient(135deg, #37bc0b 0%, #2d9a0a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: savingMarks ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1em',
                transition: 'all 0.3s ease',
                minWidth: '150px',
              }}
            >
              {savingMarks ? 'Saving...' : '✓ Save All Marks'}
            </button>
          </div>
        </div>
      )}

      {/* Add inline styles for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          
          input[type="number"],
          input[type="text"] {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EnterMarks;
