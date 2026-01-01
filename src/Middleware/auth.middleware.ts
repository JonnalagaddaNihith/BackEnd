import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../Models/Response';

// Extend Express Request to include user information
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'owner' | 'tenant' | 'admin';
  };
}

// Middleware to verify JWT token and authenticate requests
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Access denied. No token provided.',
        error: 'Authentication token is required',
      };
      res.status(401).json(response);
      return;
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
      email: string;
      role: 'owner' | 'tenant' | 'admin';
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('❌ Token verification error:', error.message);
    
    let errorMessage = 'Invalid or expired token';
    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired';
    }

    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed',
      error: errorMessage,
    };
    res.status(403).json(response);
    return;
  }
};

// Middleware to authorize based on user roles
export const authorizeRoles = (...allowedRoles: Array<'owner' | 'tenant' | 'admin'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'Access denied. User not authenticated.',
          error: 'User information not found in request',
        };
        res.status(401).json(response);
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        const response: ApiResponse = {
          success: false,
          message: 'Access denied. Insufficient permissions.',
          error: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        };
        res.status(403).json(response);
        return;
      }

      next();
    } catch (error: any) {
      console.error('❌ Authorization error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Authorization failed',
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }
  };
};
