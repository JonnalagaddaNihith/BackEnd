import { Router } from 'express';
import { PropertyController } from '../Controllers/property.controller';
import { authenticateToken, authorizeRoles } from '../Middleware/auth.middleware';
import { validatePropertyCreation } from '../Middleware/validation.middleware';

const router = Router();

/**
 * @route   GET /api/properties
 * @desc    Get all properties with optional filters
 * @access  Public
 */
router.get('/', PropertyController.getAllProperties);

/**
 * @route   GET /api/properties/owner/me
 * @desc    Get properties for current owner
 * @access  Private/Owner
 */
router.get(
  '/owner/me',
  authenticateToken,
  authorizeRoles('Owner'),
  PropertyController.getMyProperties
);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id', PropertyController.getPropertyById);

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private/Owner
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Owner'),
  validatePropertyCreation,
  PropertyController.createProperty
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private/Owner
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Owner'),
  PropertyController.updateProperty
);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property
 * @access  Private/Owner
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Owner'),
  PropertyController.deleteProperty
);

export default router;
