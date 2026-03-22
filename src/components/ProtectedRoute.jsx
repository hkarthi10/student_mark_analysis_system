/**
 * Protected Routes Component
 * Checks authentication and role-based access
 */

import React from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('authToken');

  // Not authenticated
  if (!token || !user.id) {
    window.location.href = '/';
    return null;
  }

  // Role check
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          border: '2px solid var(--border-color)',
        }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '15px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-gray)', marginBottom: '20px' }}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4FACFE 0%, #8E2DE2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
