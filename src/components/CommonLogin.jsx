import React, { useState } from 'react';
import '../styles/common.css';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { useAuth } from '../context/AuthContext';

const CommonLogin = ({ role, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { login, user, loading } = useAuth();

  // Role-specific configurations
  const roleConfig = {
    admin: {
      title: 'Admin Login',
      subtitle: 'Access Admin Dashboard',
      description: 'Enter your admin credentials to manage the system'
    },
    student: {
      title: 'Student Login',
      subtitle: 'View Your Marks',
      description: 'Enter your student credentials to view your academic results'
    },
    teacher: {
      title: 'Teacher Login',
      subtitle: 'Manage Student Records',
      description: 'Enter your teacher credentials to manage student marks'
    }
  };

  const config = roleConfig[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      return;
    }

    // Ensure the user logs in via the correct portal for their role
    if (result.user.role !== role) {
      setError(`This account is not a ${role}. Please choose the correct portal.`);
      return;
    }

    setError('');
    setIsLoggedIn(true);
  };

  if (isLoggedIn && user) {
    if (role === 'admin') {
      return <AdminDashboard onLogout={() => window.location.reload()} />;
    }
    if (role === 'teacher') {
      return <TeacherDashboard onLogout={() => window.location.reload()} />;
    }
    if (role === 'student') {
      return <StudentDashboard onLogout={() => window.location.reload()} />;
    }
  }

  
  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <div className="login-header">
          <button className="back-button" onClick={onBack} title="Back">
            ← 
          </button>
          <div>
            <h1>{config.title}</h1>
            <p style={{ color: '#718096', fontSize: '0.9em', margin: '5px 0 0 0' }}>
              {config.subtitle}
            </p>
          </div>
        </div>

        <p style={{ 
          color: '#718096', 
          fontSize: '0.95em', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          {config.description}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#e53e3e',
              fontSize: '0.9em',
              padding: '10px',
              backgroundColor: 'rgba(229, 62, 62, 0.1)',
              borderRadius: '6px',
              borderLeft: '3px solid #e53e3e'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${config.title.split(' ')[0]}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommonLogin;
