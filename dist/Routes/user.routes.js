"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../Controllers/user.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', auth_middleware_1.authenticateToken, user_controller_1.UserController.getProfile);
/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', auth_middleware_1.authenticateToken, user_controller_1.UserController.updateProfile);
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', auth_middleware_1.authenticateToken, user_controller_1.UserController.getUserById);
/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin'), user_controller_1.UserController.getAllUsers);
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin'), user_controller_1.UserController.deleteUser);
exports.default = router;
