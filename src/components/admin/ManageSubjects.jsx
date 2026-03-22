/**
 * Admin - Manage Subjects Page
 * Create, edit, and delete subjects
 */

import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const ManageSubjects = () => {
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    department: 'CS',
    credits: '3',
    semester: '1',
    teacher_id: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/admin/subjects');
      setSubjects(response.data.data);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/all-teachers');
      setTeachers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingId) {
        // Update existing subject
        await api.put(`/admin/subject/${editingId}`, {
          subject_name: formData.subject_name,
          credits: parseInt(formData.credits),
          teacher_id: formData.teacher_id || null,
          semester: parseInt(formData.semester),
        });
        setSuccessMsg('Subject updated successfully!');
        setEditingId(null);
      } else {
        // Create new subject
        await api.post('/admin/create-subject', {
          subject_code: formData.subject_code,
          subject_name: formData.subject_name,
          department: formData.department,
          credits: parseInt(formData.credits),
          semester: parseInt(formData.semester),
          teacher_id: formData.teacher_id || null,
        });
        setSuccessMsg('Subject created successfully!');
      }

      // Reset form
      setFormData({
        subject_code: '',
        subject_name: '',
        department: 'CS',
        credits: '3',
        semester: '1',
        teacher_id: '',
      });

      setShowForm(false);
      await fetchSubjects();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save subject');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      department: subject.department,
      credits: subject.credits.toString(),
      semester: (subject.semester || '1').toString(),
      teacher_id: subject.teacher_id ? subject.teacher_id.toString() : '',
    });
    setEditingId(subject.id);
    setShowForm(true);
  };

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"?`)) return;

    try {
      await api.delete(`/admin/subject/${subjectId}`);
      setSuccessMsg('Subject deleted successfully!');
      await fetchSubjects();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to delete subject');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      subject_code: '',
      subject_name: '',
      department: 'CS',
      credits: '3',
      semester: '1',
      teacher_id: '',
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1a202c', margin: '0' }}>Manage Subjects</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + New Subject
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{
          color: '#2d5016',
          background: 'rgba(55, 188, 11, 0.1)',
          padding: '12px',
          borderRadius: '6px',
          borderLeft: '3px solid #22863a',
          marginBottom: '20px',
        }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          color: '#e53e3e',
          background: 'rgba(229, 62, 62, 0.1)',
          padding: '12px',
          borderRadius: '6px',
          borderLeft: '3px solid #e53e3e',
          marginBottom: '20px',
        }}>
          {errorMsg}
        </div>
      )}

      {showForm && (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          border: '2px solid #CBD5E1',
          marginBottom: '30px',
        }}>
          <h3 style={{ color: '#1a202c', marginTop: '0' }}>{editingId ? 'Edit Subject' : 'Create New Subject'}</h3>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {!editingId && (
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                  Subject Code (e.g., CS401) *
                </label>
                <input
                  type="text"
                  name="subject_code"
                  value={formData.subject_code}
                  onChange={handleChange}
                  required={!editingId}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                Subject Name *
              </label>
              <input
                type="text"
                name="subject_name"
                value={formData.subject_name}
                onChange={handleChange}
                required
                placeholder="e.g., Advanced Data Structures"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {!editingId && (
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="CS">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                Credits *
              </label>
              <select
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                Assign Teacher (Optional)
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Saving...' : editingId ? 'Update Subject' : 'Create Subject'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  flex: 1,
                  background: '#CBD5E1',
                  color: '#1a202c',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#1a202c', marginBottom: '20px' }}>All Subjects</h3>
        {subjects.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '20px' }}>No subjects created yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Credits</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Sem</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Teacher</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, idx) => (
                  <tr
                    key={subject.id}
                    style={{
                      background: idx % 2 === 0 ? '#F5F7FF' : 'white',
                      borderBottom: '1px solid #CBD5E1',
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1a202c' }}>
                      {subject.subject_code}
                    </td>
                    <td style={{ padding: '12px', color: '#1a202c' }}>
                      {subject.subject_name}
                    </td>
                    <td style={{ padding: '12px', color: '#718096', fontSize: '14px' }}>
                      {subject.department}
                    </td>
                    <td style={{ padding: '12px', color: '#718096', textAlign: 'center', fontSize: '14px' }}>
                      {subject.credits}
                    </td>
                    <td style={{ padding: '12px', color: '#718096', textAlign: 'center', fontSize: '14px' }}>
                      {subject.semester || '-'}
                    </td>
                    <td style={{ padding: '12px', color: '#718096', fontSize: '14px' }}>
                      {subject.teacher_name || 'Unassigned'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(subject)}
                        style={{
                          background: 'rgba(74, 144, 226, 0.2)',
                          color: '#2c5282',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          marginRight: '8px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id, subject.subject_code)}
                        style={{
                          background: 'rgba(229, 62, 62, 0.2)',
                          color: '#e53e3e',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubjects;
