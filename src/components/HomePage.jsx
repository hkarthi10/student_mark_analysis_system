import React, { useState } from 'react';
import '../styles/common.css';
import logo from '../assets/Group 6.png';
import CommonLogin from './CommonLogin';

const HomePage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  if (selectedRole) {
    return <CommonLogin role={selectedRole} onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo-container">
          <img src={logo} alt="Student Mark Analysis Logo" className="logo" />
        </div>
        
        <h1 className='title'>Student Mark Analysis</h1>
        <p>Select your role to continue</p>
        
        <div className="buttons-container">
          <button className="role-button" onClick={() => setSelectedRole('admin')}>
            Admin
          </button>
          
          <button className="role-button" onClick={() => setSelectedRole('student')}>
            Student
          </button>
          
          <button className="role-button" onClick={() => setSelectedRole('teacher')}>
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
