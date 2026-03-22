/**
 * Global Error Handling Middleware
 * Catches all errors and returns consistent response format
 */

export const globalErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Database constraint error
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry. This record already exists.',
    });
  }

  // Foreign key constraint error
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Invalid reference. The related record does not exist.',
    });
  }

  // Generic error
  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error.',
  });
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: '404 - Route not found.',
  });
};
