/**
 * Axios API Client Setup
 * Handles all HTTP requests with JWT token management
 * Auto-adds Authorization header to protected routes
 */

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds JWT token to every request if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles responses and errors globally
 * If token is invalid/expired, redirect to login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/'; // Redirect to home/login
    }

    // Other errors
    return Promise.reject(error);
  }
);

export default api;
