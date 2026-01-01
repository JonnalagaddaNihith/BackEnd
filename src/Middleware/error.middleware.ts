import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../Models/Response';

// Global error handling middleware
// This should be the last middleware in the chain
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Global Error Handler:', error);
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let errorDetail = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : error.stack;
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized Access';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource Not Found';
  } else if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry. Resource already exists.';
    errorDetail = 'The data you are trying to insert already exists in the database.';
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Invalid reference';
    errorDetail = 'Referenced record does not exist.';
  }

  const response: ApiResponse = {
    success: false,
    message,
    error: errorDetail,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  };
  
  res.status(404).json(response);
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
