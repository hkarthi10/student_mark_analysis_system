import React, { useState } from 'react';
import '../styles/common.css';
import logo from '../assets/Group 6.png';

const AdminLogin = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    // Handle login logic here
    console.log('Login attempt:', { email, password });
    setError('');
    // You can add your API call here or redirect to dashboard
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <div className="login-header">
          <button className="back-button" onClick={onBack} title="Back">
            ← 
          </button>
          <h1>Admin Login</h1>
        </div>

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

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
