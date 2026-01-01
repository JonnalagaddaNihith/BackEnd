import { Router } from 'express';
import { BookingController } from '../Controllers/booking.controller';
import { authenticateToken, authorizeRoles } from '../Middleware/auth.middleware';
import {
  validateBookingCreation,
  validateBookingStatusUpdate,
} from '../Middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private/Tenant
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('tenant'),
  validateBookingCreation,
  BookingController.createBooking
);

/**
 * @route   GET /api/bookings/tenant/me
 * @desc    Get all bookings for current tenant
 * @access  Private/Tenant
 */
router.get(
  '/tenant/me',
  authenticateToken,
  authorizeRoles('tenant'),
  BookingController.getMyBookings
);

/**
 * @route   GET /api/bookings/owner/me
 * @desc    Get all bookings for current owner's properties
 * @access  Private/Owner
 */
router.get(
  '/owner/me',
  authenticateToken,
  authorizeRoles('owner'),
  BookingController.getBookingsForMyProperties
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, BookingController.getBookingById);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin only)
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  BookingController.getAllBookings
);

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private/Owner
 */
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('owner'),
  validateBookingStatusUpdate,
  BookingController.updateBookingStatus
);

/**
 * @route   DELETE /api/bookings/:id/cancel
 * @desc    Cancel booking (Tenant only, pending bookings)
 * @access  Private/Tenant
 */
router.delete(
  '/:id/cancel',
  authenticateToken,
  authorizeRoles('tenant'),
  BookingController.cancelBooking
);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Delete booking (Admin only)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  BookingController.deleteBooking
);

export default router;
