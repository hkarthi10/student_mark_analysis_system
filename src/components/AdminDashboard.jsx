import React, { useState } from 'react';
import '../styles/common.css';
import CreateUser from './admin/CreateUser';
import ManageSubjects from './admin/ManageSubjects';
import Reports from './admin/Reports';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <button 
          className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`sidebar-nav ${sidebarOpen ? 'active' : ''}`}>
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('dashboard');
              closeSidebar();
            }}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('users');
              closeSidebar();
            }}
          >
            Manage Users
          </button>
          <button
            className={`nav-item ${activeSection === 'subjects' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('subjects');
              closeSidebar();
            }}
          >
            Manage Subjects
          </button>
          <button
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('reports');
              closeSidebar();
            }}
          >
            Reports
          </button>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Dashboard Overview */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-overview-content">
            <h1 className="dashboard-topbar-title">Welcome to Admin Dashboard</h1>
            <div className="dashboard-overview-grid">
              <div className="overview-card primary"
              onClick={() => setActiveSection('users')}
              >
                <h3>Manage Users</h3>
                <p>Create, edit, and delete students & teachers</p>
              </div>

              <div className="overview-card success"
              onClick={() => setActiveSection('subjects')}
              >
                <h3>Manage Subjects</h3>
                <p>Create and assign subjects with credits</p>
              </div>

              <div className="overview-card warning"
              onClick={() => setActiveSection('reports')}
              >
                <h3>Reports</h3>
                <p>View system stats and export data</p>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeSection === 'users' && <CreateUser />}

        {/* Subject Management */}
        {activeSection === 'subjects' && <ManageSubjects />}

        {/* Reports */}
        {activeSection === 'reports' && <Reports />}
      </main>
    </div>
  );
};

export default AdminDashboard;
