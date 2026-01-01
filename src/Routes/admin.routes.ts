import { Router } from 'express';
import { AdminController } from '../Controllers/admin.controller';
import { authenticateToken, authorizeRoles } from '../Middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/admin/analytics
 * @desc    Get admin dashboard analytics
 * @access  Private/Admin
 */
router.get(
  '/analytics',
  authenticateToken,
  authorizeRoles('Admin'),
  AdminController.getAnalytics
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with stats
 * @access  Private/Admin
 */
router.get(
  '/users',
  authenticateToken,
  authorizeRoles('Admin'),
  AdminController.getAllUsers
);

/**
 * @route   GET /api/admin/properties
 * @desc    Get all properties for admin review
 * @access  Private/Admin
 */
router.get(
  '/properties',
  authenticateToken,
  authorizeRoles('Admin'),
  AdminController.getAllProperties
);

/**
 * @route   DELETE /api/admin/properties/:id
 * @desc    Delete property (hard delete)
 * @access  Private/Admin
 */
router.delete(
  '/properties/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  AdminController.deleteProperty
);

export default router;
