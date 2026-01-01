"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookingStatusUpdate = exports.validateBookingCreation = exports.validatePropertyCreation = exports.validateUserLogin = exports.validateUserRegistration = void 0;
const utils_1 = require("../Config/utils");
// Validation middleware for user registration
const validateUserRegistration = (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const { isValid, missingFields } = (0, utils_1.validateRequiredFields)(req.body, [
            'name',
            'email',
            'password',
            'role',
        ]);
        if (!isValid) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Missing required fields: ${missingFields.join(', ')}`,
            };
            res.status(400).json(response);
            return;
        }
        if (!(0, utils_1.isValidEmail)(email)) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Invalid email format',
            };
            res.status(400).json(response);
            return;
        }
        if (password.length < 6) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Password must be at least 6 characters long',
            };
            res.status(400).json(response);
            return;
        }
        const validRoles = ['owner', 'tenant', 'admin'];
        if (!validRoles.includes(role.toLowerCase())) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Invalid role. Must be one of: Owner, Tenant, Admin`,
            };
            res.status(400).json(response);
            return;
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Validation error',
            error: error.message,
        };
        res.status(500).json(response);
    }
};
exports.validateUserRegistration = validateUserRegistration;
// validation middleware for user login
const validateUserLogin = (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { isValid, missingFields } = (0, utils_1.validateRequiredFields)(req.body, [
            'email',
            'password',
        ]);
        if (!isValid) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Missing required fields: ${missingFields.join(', ')}`,
            };
            res.status(400).json(response);
            return;
        }
        if (!(0, utils_1.isValidEmail)(email)) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Invalid email format',
            };
            res.status(400).json(response);
            return;
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Validation error',
            error: error.message,
        };
        res.status(500).json(response);
    }
};
exports.validateUserLogin = validateUserLogin;
const validatePropertyCreation = (req, res, next) => {
    try {
        const { title, rent_per_day, location } = req.body;
        const { isValid, missingFields } = (0, utils_1.validateRequiredFields)(req.body, [
            'title',
            'rent_per_day',
            'location',
        ]);
        if (!isValid) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Missing required fields: ${missingFields.join(', ')}`,
            };
            res.status(400).json(response);
            return;
        }
        if (isNaN(rent_per_day) || rent_per_day <= 0) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Rent amount must be greater than zero',
            };
            res.status(400).json(response);
            return;
        }
        if (!title.trim() || !location.trim()) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Title and location must not be empty',
            };
            res.status(400).json(response);
            return;
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Validation error',
            error: error.message,
        };
        res.status(500).json(response);
    }
};
exports.validatePropertyCreation = validatePropertyCreation;
// validation middleware for booking creation
const validateBookingCreation = (req, res, next) => {
    try {
        const { property_id, check_in, check_out } = req.body;
        const { isValid, missingFields } = (0, utils_1.validateRequiredFields)(req.body, [
            'property_id',
            'check_in',
            'check_out',
        ]);
        if (!isValid) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Missing required fields: ${missingFields.join(', ')}`,
            };
            res.status(400).json(response);
            return;
        }
        if (isNaN(property_id) || property_id <= 0) {
            const response = {
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
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Invalid date format for check_in or check_out',
            };
            res.status(400).json(response);
            return;
        }
        if (checkInDate >= checkOutDate) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Check-out date must be after check-in date',
            };
            res.status(400).json(response);
            return;
        }
        if (checkInDate < new Date()) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Check-in date cannot be in the past',
            };
            res.status(400).json(response);
            return;
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Validation error',
            error: error.message,
        };
        res.status(500).json(response);
    }
};
exports.validateBookingCreation = validateBookingCreation;
// validation middleware for booking status update
const validateBookingStatusUpdate = (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: 'Status is required',
            };
            res.status(400).json(response);
            return;
        }
        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            const response = {
                success: false,
                message: 'Validation failed',
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            };
            res.status(400).json(response);
            return;
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Validation error',
            error: error.message,
        };
        res.status(500).json(response);
    }
};
exports.validateBookingStatusUpdate = validateBookingStatusUpdate;
