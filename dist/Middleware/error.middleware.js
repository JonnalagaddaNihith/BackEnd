"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
// Global error handling middleware
// This should be the last middleware in the chain
const errorHandler = (error, req, res, next) => {
    console.error('❌ Global Error Handler:', error);
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errorDetail = process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.stack;
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized Access';
    }
    else if (error.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Resource Not Found';
    }
    else if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry. Resource already exists.';
        errorDetail = 'The data you are trying to insert already exists in the database.';
    }
    else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Invalid reference';
        errorDetail = 'Referenced record does not exist.';
    }
    const response = {
        success: false,
        message,
        error: errorDetail,
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    const response = {
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`,
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
// Async handler wrapper to catch errors in async route handlers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
