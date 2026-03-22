import React, { useState } from 'react';
import '../styles/common.css';
import ViewMarks from './student/ViewMarks';
import PerformanceAnalysis from './student/PerformanceAnalysis';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('view-marks');
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
          <h2 style={{ margin: '0', fontSize: '1.3em' }}>Student Portal</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', opacity: 0.9 }}>
            {user?.name || 'Student'}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0 15px' }}>
          <button
            onClick={() => setActiveSection('view-marks')}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '6px',
              background: activeSection === 'view-marks' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1em',
              fontWeight: activeSection === 'view-marks' ? '600' : '400',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = activeSection === 'view-marks' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            View Marks
          </button>

          <button
            onClick={() => setActiveSection('performance')}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '6px',
              background: activeSection === 'performance' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1em',
              fontWeight: activeSection === 'performance' ? '600' : '400',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = activeSection === 'performance' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            Performance Analysis
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
            {activeSection === 'view-marks' && 'Marksheet'}
            {activeSection === 'performance' && 'Performance Analysis'}
          </h1>
          <span style={{ color: '#718096', fontSize: '0.9em' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Content Area */}
        <div style={{ padding: '0' }}>
          {activeSection === 'view-marks' && <ViewMarks />}
          {activeSection === 'performance' && <PerformanceAnalysis />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
