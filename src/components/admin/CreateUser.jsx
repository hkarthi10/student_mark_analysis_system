/**
 * Admin - Create & Manage Users Page
 * Create, edit, and delete students and teachers
 */

import React, { useState, useEffect } from 'react';
import api from '../../utils/api.js';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'CS',
    roll_number: '',
    semester: '1',
    qualification: 'M.Tech',
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [students, teachers] = await Promise.all([
        api.get('/admin/all-students'),
        api.get('/admin/all-teachers'),
      ]);

      const allUsers = [
        ...students.data.data.map(s => ({ ...s, role: 'student' })),
        ...teachers.data.data.map(t => ({ ...t, role: 'teacher' })),
      ];
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
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
        // Update existing user
        await api.put(`/admin/user/${editingId}`, {
          name: formData.name,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
          department: formData.department,
        });
        setSuccessMsg('User updated successfully!');
        setEditingId(null);
      } else {
        // Create new user
        await api.post('/admin/create-user', formData);
        setSuccessMsg(`${formData.role} created successfully!`);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: 'CS',
        roll_number: '',
        semester: '1',
        qualification: 'M.Tech',
      });
      
      setShowForm(false);
      await fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department,
      roll_number: user.roll_number || '',
      semester: user.semester || '1',
      qualification: user.qualification || 'M.Tech',
    });
    setEditingId(user.user_id);
    setShowForm(true);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;

    try {
      await api.delete(`/admin/user/${userId}`);
      setSuccessMsg('User deleted successfully!');
      await fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: 'CS',
      roll_number: '',
      semester: '1',
      qualification: 'M.Tech',
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1a202c', margin: '0' }}>Manage Users</h2>
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
            + New User
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
          <h3 style={{ color: '#1a202c', marginTop: '0' }}>{editingId ? 'Edit User' : 'Create New User'}</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>
                Password {editingId ? '(leave empty to keep existing)' : '*'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingId}
                minLength={6}
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

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={editingId}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: editingId ? 'not-allowed' : 'pointer',
                }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Department *</label>
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

            {formData.role === 'student' && (
              <>
                <div>
                  <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Roll Number *</label>
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="e.g., CS21001"
                    required
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

                <div>
                  <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Semester *</label>
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
              </>
            )}

            {formData.role === 'teacher' && (
              <div>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#1a202c' }}>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., PhD in Computer Science"
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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
                {loading ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
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
        <h3 style={{ color: '#1a202c', marginBottom: '20px' }}>Users List</h3>
        {users.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '20px' }}>No users created yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Details</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.user_id}
                    style={{
                      background: idx % 2 === 0 ? '#F5F7FF' : 'white',
                      borderBottom: '1px solid #CBD5E1',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#1a202c' }}>{user.name}</td>
                    <td style={{ padding: '12px', color: '#718096', fontSize: '14px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: user.role === 'student' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(142, 45, 226, 0.1)',
                        color: user.role === 'student' ? '#2c5282' : '#6b21a8',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#718096', fontSize: '14px' }}>{user.department}</td>
                    <td style={{ padding: '12px', color: '#718096', fontSize: '13px' }}>
                      {user.role === 'student' ? `Roll: ${user.roll_number}` : `Qual: ${user.qualification}`}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(user)}
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
                        onClick={() => handleDelete(user.user_id, user.name)}
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

export default CreateUser;
