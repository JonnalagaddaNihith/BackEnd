"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../Controllers/admin.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/admin/analytics
 * @desc    Get admin dashboard analytics
 * @access  Private/Admin
 */
router.get('/analytics', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), admin_controller_1.AdminController.getAnalytics);
/**
 * @route   GET /api/admin/users
 * @desc    Get all users with stats
 * @access  Private/Admin
 */
router.get('/users', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), admin_controller_1.AdminController.getAllUsers);
/**
 * @route   GET /api/admin/properties
 * @desc    Get all properties for admin review
 * @access  Private/Admin
 */
router.get('/properties', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), admin_controller_1.AdminController.getAllProperties);
/**
 * @route   DELETE /api/admin/properties/:id
 * @desc    Delete property (hard delete)
 * @access  Private/Admin
 */
router.delete('/properties/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), admin_controller_1.AdminController.deleteProperty);
exports.default = router;
