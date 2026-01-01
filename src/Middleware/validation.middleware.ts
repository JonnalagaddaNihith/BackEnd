import { Request, Response, NextFunction } from 'express';
import { validateRequiredFields, isValidEmail } from '../Config/utils';
import { ApiResponse } from '../Models/Response';

// Validation middleware for user registration
export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { name, email, password, role } = req.body;
    const { isValid, missingFields } = validateRequiredFields(req.body, [
      'name',
      'email',
      'password',
      'role',
    ]);

    if (!isValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Missing required fields: ${missingFields.join(', ')}`,
      };
      res.status(400).json(response);
      return;
    }
    if (!isValidEmail(email)) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid email format',
      };
      res.status(400).json(response);
      return;
    }
    if (password.length < 6) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Password must be at least 6 characters long',
      };
      res.status(400).json(response);
      return;
    }
    const validRoles = ['owner', 'tenant', 'admin'];
    if (!validRoles.includes(role.toLowerCase())) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Invalid role. Must be one of: Owner, Tenant, Admin`,
      };
      res.status(400).json(response);
      return;
    }

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};

// validation middleware for user login
export const validateUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { email, password } = req.body;
    const { isValid, missingFields } = validateRequiredFields(req.body, [
      'email',
      'password',
    ]);

    if (!isValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Missing required fields: ${missingFields.join(', ')}`,
      };
      res.status(400).json(response);
      return;
    }
    if (!isValidEmail(email)) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid email format',
      };
      res.status(400).json(response);
      return;
    }

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};
export const validatePropertyCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { title, rent_per_day, location } = req.body;
    const { isValid, missingFields } = validateRequiredFields(req.body, [
      'title',
      'rent_per_day',
      'location',
    ]);

    if (!isValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Missing required fields: ${missingFields.join(', ')}`,
      };
      res.status(400).json(response);
      return;
    }
    if (isNaN(rent_per_day) || rent_per_day <= 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Rent amount must be greater than zero',
      };
      res.status(400).json(response);
      return;
    }
    if (!title.trim() || !location.trim()) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Title and location must not be empty',
      };
      res.status(400).json(response);
      return;
    }

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};

// validation middleware for booking creation
export const validateBookingCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { property_id, check_in, check_out } = req.body;
    const { isValid, missingFields } = validateRequiredFields(req.body, [
      'property_id',
      'check_in',
      'check_out',
    ]);

    if (!isValid) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Missing required fields: ${missingFields.join(', ')}`,
      };
      res.status(400).json(response);
      return;
    }
    if (isNaN(property_id) || property_id <= 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid property ID',
      };
      res.status(400).json(response);
      return;
    }
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Invalid date format for check_in or check_out',
      };
      res.status(400).json(response);
      return;
    }

    if (checkInDate >= checkOutDate) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Check-out date must be after check-in date',
      };
      res.status(400).json(response);
      return;
    }

    if (checkInDate < new Date()) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Check-in date cannot be in the past',
      };
      res.status(400).json(response);
      return;
    }

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};

// validation middleware for booking status update
export const validateBookingStatusUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { status } = req.body;
    if (!status) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'Status is required',
      };
      res.status(400).json(response);
      return;
    }
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
      res.status(400).json(response);
      return;
    }

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};
