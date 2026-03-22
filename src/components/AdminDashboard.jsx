import React, { useState } from 'react';
import '../styles/common.css';
import CreateUser from './admin/CreateUser';
import ManageSubjects from './admin/ManageSubjects';
import Reports from './admin/Reports';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            Manage Users
          </button>
          <button
            className={`nav-item ${activeSection === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveSection('subjects')}
          >
            Manage Subjects
          </button>
          <button
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
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
          <div style={{ padding: '30px' }}>
            <h1 style={{ color: '#1a202c', marginBottom: '30px' }}>Welcome to Admin Dashboard</h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => setActiveSection('users')}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3em', fontWeight: '600' }}>Manage Users</h3>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>Create, edit, and delete students & teachers</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(132, 250, 176, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => setActiveSection('subjects')}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3em', fontWeight: '600' }}>Manage Subjects</h3>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>Create and assign subjects with credits</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => setActiveSection('reports')}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3em', fontWeight: '600' }}>Reports</h3>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>View system stats and export data</p>
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
