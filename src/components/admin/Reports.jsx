/**
 * Admin - Reports Page
 * View system-wide reports and performance data with GPA analytics
 */

import React, { useState, useEffect } from 'react';
import '../../styles/common.css';
import api from '../../utils/api.js';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [allMarks, setAllMarks] = useState([]);
  const [gpaReport, setGpaReport] = useState([]);
  const [failedStudents, setFailedStudents] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, marksRes, gpaRes, failedRes, topRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { data: null } })),
        api.get('/admin/report').catch(() => ({ data: { data: { records: [] } } })),
        api.get('/admin/gpa-report').catch(() => ({ data: { data: { records: [] } } })),
        api.get('/admin/failed-students').catch(() => ({ data: { data: { records: [] } } })),
        api.get('/admin/top-performers').catch(() => ({ data: { data: { records: [] } } })),
      ]);
      
      setStats(statsRes.data.data || null);
      setAllMarks(marksRes.data.data?.records || []);
      setGpaReport(gpaRes.data.data?.records || []);
      setFailedStudents(failedRes.data.data?.records || []);
      setTopPerformers(topRes.data.data?.records || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to load reports. Please try again.');
      // Ensure state is set to empty arrays to prevent render crash
      setStats(null);
      setAllMarks([]);
      setGpaReport([]);
      setFailedStudents([]);
      setTopPerformers([]);
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

  const getGPAColor = (gpa) => {
    if (!gpa) return '#718096';
    const numGpa = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
    if (isNaN(numGpa)) return '#718096';
    if (numGpa >= 9) return '#22863a';
    if (numGpa >= 8) return '#28a745';
    if (numGpa >= 7) return '#0366d6';
    if (numGpa >= 6) return '#f6ad55';
    if (numGpa >= 5) return '#fb7938';
    return '#d73a49';
  };

  const formatGPA = (gpa) => {
    if (!gpa && gpa !== 0) return 'N/A';
    const numGpa = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
    if (isNaN(numGpa)) return 'N/A';
    return numGpa.toFixed(2);
  };

  const handleDownloadGPAReport = () => {
    const csvContent = [
      ['Student Name', 'Roll Number', 'Semester', 'Department', 'GPA', 'CGPA', 'Failed Subjects', 'Total Subjects'],
      ...gpaReport.map(r => [
        r.student_name,
        r.roll_number,
        r.semester,
        r.department,
        r.gpa || 'N/A',
        r.cgpa || 'N/A',
        r.failed_count,
        r.total_subjects,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpa-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadMarksReport = () => {
    const csvContent = [
      ['Student Name', 'Roll Number', 'Subject Code', 'Subject Name', 'Internal', 'External', 'Total', 'Grade'],
      ...allMarks.map(r => [
        r.student_name,
        r.roll_number,
        r.subject_code,
        r.subject_name,
        r.internal_marks,
        r.external_marks,
        r.total_marks,
        r.grade,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabButtonStyle = (tab) => ({
    padding: '12px 20px',
    background: activeTab === tab ? 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)' : 'transparent',
    color: activeTab === tab ? 'white' : '#718096',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #4FACFE' : 'none',
    cursor: 'pointer',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#1a202c', marginBottom: '25px', fontSize: '2em', fontWeight: 'bold', letterSpacing: '-0.5px' }}>System Reports</h2>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '25px', 
        borderBottom: '2px solid #CBD5E1',
        overflowX: 'auto',
      }}>
        <button onClick={() => setActiveTab('stats')} style={tabButtonStyle('stats')}>
          System Stats
        </button>
        <button onClick={() => setActiveTab('gpa')} style={tabButtonStyle('gpa')}>
          GPA Report
        </button>
        <button onClick={() => setActiveTab('top')} style={tabButtonStyle('top')}>
          Top Performers
        </button>
        <button onClick={() => setActiveTab('failed')} style={tabButtonStyle('failed')}>
          Failed Students
        </button>
        <button onClick={() => setActiveTab('marks')} style={tabButtonStyle('marks')}>
          All Marks
        </button>
      </div>

      {error && (
        <div style={{
          color: '#e53e3e',
          background: 'rgba(229, 62, 62, 0.1)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #e53e3e',
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#718096',
        }}>
          Loading reports...
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && !loading && stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Total Students</p>
            <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
              {stats.total_students}
            </h3>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Total Teachers</p>
            <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
              {stats.total_teachers}
            </h3>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Total Subjects</p>
            <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
              {stats.total_subjects}
            </h3>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Pass Percentage</p>
            <h3 style={{ color: '#22863a', margin: '0', fontSize: '2em', fontWeight: '700' }}>
              {stats.pass_percentage}%
            </h3>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '0.9em' }}>Departments</p>
            <h3 style={{ color: '#1a202c', margin: '0', fontSize: '2em', fontWeight: '700' }}>
              {stats.total_departments}
            </h3>
          </div>
        </div>
      )}

      {/* GPA Report Tab */}
      {activeTab === 'gpa' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ color: '#718096', margin: '0' }}>Total Students: {gpaReport.length}</p>
            <button
              onClick={handleDownloadGPAReport}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              📥 Download GPA Report
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading GPA report...</p>
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
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Roll Number</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Semester</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>GPA</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>CGPA</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {gpaReport.map((record, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #CBD5E1' }}>
                      <td style={{ padding: '15px', color: '#1a202c', fontWeight: '600' }}>
                        {record.student_name}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.roll_number}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c' }}>
                        Sem {record.semester}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.department}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        background: getGPAColor(record.gpa),
                        color: 'white',
                        borderRadius: '6px',
                        margin: '5px',
                      }}>
                        {formatGPA(record.gpa)}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        background: getGPAColor(record.cgpa),
                        color: 'white',
                        borderRadius: '6px',
                        margin: '5px',
                      }}>
                        {formatGPA(record.cgpa)}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: record.failed_count > 0 ? '#d73a49' : '#22863a',
                        fontWeight: '600',
                      }}>
                        {record.failed_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Top Performers Tab */}
      {activeTab === 'top' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#718096' }}>Total Records: {topPerformers.length}</p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading top performers...</p>
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
                <thead style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Rank</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Roll Number</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Semester</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((record, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #CBD5E1' }}>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '1.1em',
                        color: idx === 0 ? '#d4af37' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#1a202c',
                      }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '15px', color: '#1a202c', fontWeight: '600' }}>
                        {record.student_name}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.roll_number}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c' }}>
                        Sem {record.semester}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.department}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        background: getGPAColor(record.gpa),
                        color: 'white',
                        borderRadius: '6px',
                        margin: '5px',
                      }}>
                        {formatGPA(record.gpa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Failed Students Tab */}
      {activeTab === 'failed' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#718096' }}>Total Failed Records: {failedStudents.length}</p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading failed students...</p>
          ) : failedStudents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}>
                <thead style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Roll Number</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Semester</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Subject Code</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Subject Name</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Marks</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Total Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {failedStudents.map((record, idx) => (
                    <tr key={idx} style={{ 
                      borderTop: '1px solid #CBD5E1',
                      background: idx % 2 === 0 ? 'transparent' : '#fef2f2',
                    }}>
                      <td style={{ padding: '15px', color: '#1a202c', fontWeight: '600' }}>
                        {record.student_name}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.roll_number}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c' }}>
                        Sem {record.semester}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.department}
                      </td>
                      <td style={{ padding: '15px', color: '#718096', fontWeight: '600' }}>
                        {record.subject_code}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.subject_name}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        background: '#d73a49',
                        color: 'white',
                        borderRadius: '6px',
                      }}>
                        {record.total_marks}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#d73a49',
                      }}>
                        {record.total_failed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              background: '#f0f8ff',
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#22863a',
            }}>
              <p style={{ fontSize: '1.1em', fontWeight: '600' }}>Great! No failed subjects found.</p>
            </div>
          )}
        </div>
      )}

      {/* Marks Report Tab */}
      {activeTab === 'marks' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ color: '#718096', margin: '0' }}>Total Records: {allMarks.length}</p>
            <button
              onClick={handleDownloadMarksReport}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              📥 Download Marks CSV
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading marks...</p>
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
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Student</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Roll No</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Subject</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Internal</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>External</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Total</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {allMarks.map((record, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #CBD5E1' }}>
                      <td style={{ padding: '15px', color: '#1a202c', fontWeight: '600' }}>
                        {record.student_name}
                      </td>
                      <td style={{ padding: '15px', color: '#718096' }}>{record.roll_number}</td>
                      <td style={{ padding: '15px', color: '#718096' }}>
                        {record.subject_code} - {record.subject_name}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c' }}>
                        {record.internal_marks}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#1a202c' }}>
                        {record.external_marks}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: '#1a202c',
                        fontWeight: '600',
                      }}>
                        {record.total_marks}
                      </td>
                      <td style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: 'white',
                        background: getGradeColor(record.grade),
                        fontWeight: '600',
                        borderRadius: '6px',
                        margin: '5px',
                      }}>
                        {record.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
