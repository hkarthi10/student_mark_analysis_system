import React from 'react';
import HomePage from './components/HomePage';
import './App.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <HomePage />
      </div>
    </AuthProvider>
  );
}

export default App;
