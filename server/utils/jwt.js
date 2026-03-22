/**
 * JWT Token Utilities
 */

import jwt from 'jsonwebtoken';

export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { 
      id: userId, 
      email, 
      role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h' // Token expires in 24 hours
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
