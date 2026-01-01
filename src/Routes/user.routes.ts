import { Router } from 'express';
import { UserController } from '../Controllers/user.controller';
import { authenticateToken, authorizeRoles } from '../Middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, UserController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, UserController.updateProfile);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, UserController.getUserById);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', authenticateToken, authorizeRoles('admin'), UserController.getAllUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), UserController.deleteUser);

export default router;
