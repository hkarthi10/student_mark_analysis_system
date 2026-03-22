import React, { useState } from 'react';
import '../styles/common.css';
import EnterMarks from './teacher/EnterMarks';
import SubjectAnalysis from './teacher/SubjectAnalysis';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('enter-marks');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflowY: 'auto'
      }}>
        {/* Logo/Title */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
          <h2 style={{ margin: '0', fontSize: '1.3em' }}>Teacher Portal</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', opacity: 0.9 }}>
            {user?.name || 'Teacher'}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0 15px' }}>
          <button
            onClick={() => setActiveSection('enter-marks')}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '6px',
              background: activeSection === 'enter-marks' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1em',
              fontWeight: activeSection === 'enter-marks' ? '600' : '400',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = activeSection === 'enter-marks' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            Enter Marks
          </button>

          <button
            onClick={() => setActiveSection('analysis')}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '6px',
              background: activeSection === 'analysis' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1em',
              fontWeight: activeSection === 'analysis' ? '600' : '400',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = activeSection === 'analysis' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            Subject Analysis
          </button>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 15px',
              border: 'none',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1em',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(229,62,62,0.6)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top Bar */}
        <div style={{
          background: 'white',
          padding: '20px 30px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0', color: '#1a202c', fontSize: '1.5em', fontWeight: '600' }}>
            {activeSection === 'enter-marks' && 'Enter Student Marks'}
            {activeSection === 'analysis' && 'Subject Analysis'}
          </h1>
          <span style={{ color: '#718096', fontSize: '0.9em' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Content Area */}
        <div style={{ padding: '0' }}>
          {activeSection === 'enter-marks' && <EnterMarks />}
          {activeSection === 'analysis' && <SubjectAnalysis />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
