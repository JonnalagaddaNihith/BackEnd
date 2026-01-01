"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = require("../Controllers/property.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const validation_middleware_1 = require("../Middleware/validation.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/properties
 * @desc    Get all properties with optional filters
 * @access  Public
 */
router.get('/', property_controller_1.PropertyController.getAllProperties);
/**
 * @route   GET /api/properties/owner/me
 * @desc    Get properties for current owner
 * @access  Private/Owner
 */
router.get('/owner/me', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('owner'), property_controller_1.PropertyController.getMyProperties);
/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id', property_controller_1.PropertyController.getPropertyById);
/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private/Owner
 */
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('owner'), validation_middleware_1.validatePropertyCreation, property_controller_1.PropertyController.createProperty);
/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private/Owner
 */
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('owner'), property_controller_1.PropertyController.updateProperty);
/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property
 * @access  Private/Owner
 */
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('owner'), property_controller_1.PropertyController.deleteProperty);
exports.default = router;
