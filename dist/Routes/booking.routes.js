"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../Controllers/booking.controller");
const auth_middleware_1 = require("../Middleware/auth.middleware");
const validation_middleware_1 = require("../Middleware/validation.middleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private/Tenant
 */
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Tenant'), validation_middleware_1.validateBookingCreation, booking_controller_1.BookingController.createBooking);
/**
 * @route   GET /api/bookings/tenant/me
 * @desc    Get all bookings for current tenant
 * @access  Private/Tenant
 */
router.get('/tenant/me', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Tenant'), booking_controller_1.BookingController.getMyBookings);
/**
 * @route   GET /api/bookings/owner/me
 * @desc    Get all bookings for current owner's properties
 * @access  Private/Owner
 */
router.get('/owner/me', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Owner'), booking_controller_1.BookingController.getBookingsForMyProperties);
/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', auth_middleware_1.authenticateToken, booking_controller_1.BookingController.getBookingById);
/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin only)
 * @access  Private/Admin
 */
router.get('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), booking_controller_1.BookingController.getAllBookings);
/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private/Owner
 */
router.patch('/:id/status', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Owner'), validation_middleware_1.validateBookingStatusUpdate, booking_controller_1.BookingController.updateBookingStatus);
/**
 * @route   DELETE /api/bookings/:id/cancel
 * @desc    Cancel booking (Tenant only, pending bookings)
 * @access  Private/Tenant
 */
router.delete('/:id/cancel', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Tenant'), booking_controller_1.BookingController.cancelBooking);
/**
 * @route   DELETE /api/bookings/:id
 * @desc    Delete booking (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('Admin'), booking_controller_1.BookingController.deleteBooking);
exports.default = router;
