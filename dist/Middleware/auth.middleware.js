"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT token and authenticate requests
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            const response = {
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
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('❌ Token verification error:', error.message);
        let errorMessage = 'Invalid or expired token';
        if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token';
        }
        else if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired';
        }
        const response = {
            success: false,
            message: 'Authentication failed',
            error: errorMessage,
        };
        res.status(403).json(response);
        return;
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to authorize based on user roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'Access denied. User not authenticated.',
                    error: 'User information not found in request',
                };
                res.status(401).json(response);
                return;
            }
            if (!allowedRoles.includes(req.user.role)) {
                const response = {
                    success: false,
                    message: 'Access denied. Insufficient permissions.',
                    error: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
                };
                res.status(403).json(response);
                return;
            }
            next();
        }
        catch (error) {
            console.error('❌ Authorization error:', error.message);
            const response = {
                success: false,
                message: 'Authorization failed',
                error: error.message,
            };
            res.status(500).json(response);
            return;
        }
    };
};
exports.authorizeRoles = authorizeRoles;
