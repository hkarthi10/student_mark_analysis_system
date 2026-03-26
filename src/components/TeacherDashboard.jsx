import React, { useState } from 'react';
import '../styles/common.css';
import EnterMarks from './teacher/EnterMarks';
import SubjectAnalysis from './teacher/SubjectAnalysis';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('enter-marks');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="portal-dashboard-container">
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className="portal-sidebar">
        {/* Logo/Title */}
        <div className="portal-sidebar-header">
          <h2>Teacher Portal</h2>
          <p>{user?.name || 'Teacher'}</p>
        </div>

        {/* Hamburger Menu */}
        <button 
          className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`portal-sidebar-nav ${sidebarOpen ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveSection('enter-marks');
              closeSidebar();
            }}
            className={`portal-nav-button ${activeSection === 'enter-marks' ? 'active' : ''}`}
          >
            Enter Marks
          </button>

          <button
            onClick={() => {
              setActiveSection('analysis');
              closeSidebar();
            }}
            className={`portal-nav-button ${activeSection === 'analysis' ? 'active' : ''}`}
          >
            Subject Analysis
          </button>

          <hr className="portal-nav-divider" />

          <button
            onClick={handleLogout}
            className="portal-logout-button"
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="portal-main-content">
        {/* Top Bar */}
        <div className="portal-topbar">
          <h1>
            {activeSection === 'enter-marks' && 'Enter Student Marks'}
            {activeSection === 'analysis' && 'Subject Analysis'}
          </h1>
          <span className="portal-topbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Content Area */}
        <div className="portal-content-area">
          {activeSection === 'enter-marks' && <EnterMarks />}
          {activeSection === 'analysis' && <SubjectAnalysis />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
