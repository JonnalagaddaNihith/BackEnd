"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const booking_service_1 = require("../Services/booking.service");
class BookingController {
    static async createBooking(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'User not authenticated',
                    error: 'User information not found',
                };
                res.status(401).json(response);
                return;
            }
            const bookingData = {
                ...req.body,
                tenant_id: req.user.id,
            };
            const booking = await booking_service_1.BookingService.createBooking(bookingData);
            const response = {
                success: true,
                message: 'Booking request submitted successfully',
                data: booking,
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.createBooking error:', error.message);
            const response = {
                success: false,
                message: 'Failed to create booking',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async getBookingById(req, res) {
        try {
            const bookingId = parseInt(req.params.id, 10);
            if (isNaN(bookingId)) {
                const response = {
                    success: false,
                    message: 'Invalid booking ID',
                    error: 'Booking ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            const booking = await booking_service_1.BookingService.getBookingById(bookingId);
            if (req.user) {
                const canView = req.user.role === 'admin' ||
                    booking.tenant_id === req.user.id ||
                    booking.owner_id === req.user.id;
                if (!canView) {
                    const response = {
                        success: false,
                        message: 'Access denied',
                        error: 'You do not have permission to view this booking',
                    };
                    res.status(403).json(response);
                    return;
                }
            }
            const response = {
                success: true,
                message: 'Booking retrieved successfully',
                data: booking,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.getBookingById error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve booking',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
    static async getMyBookings(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'User not authenticated',
                    error: 'User information not found',
                };
                res.status(401).json(response);
                return;
            }
            const bookings = await booking_service_1.BookingService.getBookingsByTenant(req.user.id);
            const response = {
                success: true,
                message: 'Your bookings retrieved successfully',
                data: bookings,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.getMyBookings error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve your bookings',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async getBookingsForMyProperties(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'User not authenticated',
                    error: 'User information not found',
                };
                res.status(401).json(response);
                return;
            }
            const bookings = await booking_service_1.BookingService.getBookingsByOwner(req.user.id);
            const response = {
                success: true,
                message: 'Bookings for your properties retrieved successfully',
                data: bookings,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.getBookingsForMyProperties error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve bookings for your properties',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async getAllBookings(req, res) {
        try {
            const bookings = await booking_service_1.BookingService.getAllBookings();
            const response = {
                success: true,
                message: 'All bookings retrieved successfully',
                data: bookings,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.getAllBookings error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve bookings',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async updateBookingStatus(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'User not authenticated',
                    error: 'User information not found',
                };
                res.status(401).json(response);
                return;
            }
            const bookingId = parseInt(req.params.id, 10);
            if (isNaN(bookingId)) {
                const response = {
                    success: false,
                    message: 'Invalid booking ID',
                    error: 'Booking ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            const statusUpdate = { status: req.body.status };
            const booking = await booking_service_1.BookingService.updateBookingStatus(bookingId, req.user.id, statusUpdate);
            const response = {
                success: true,
                message: 'Booking status updated successfully',
                data: booking,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.updateBookingStatus error:', error.message);
            const response = {
                success: false,
                message: 'Failed to update booking status',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async cancelBooking(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    message: 'User not authenticated',
                    error: 'User information not found',
                };
                res.status(401).json(response);
                return;
            }
            const bookingId = parseInt(req.params.id, 10);
            if (isNaN(bookingId)) {
                const response = {
                    success: false,
                    message: 'Invalid booking ID',
                    error: 'Booking ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            await booking_service_1.BookingService.cancelBooking(bookingId, req.user.id);
            const response = {
                success: true,
                message: 'Booking cancelled successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.cancelBooking error:', error.message);
            const response = {
                success: false,
                message: 'Failed to cancel booking',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async deleteBooking(req, res) {
        try {
            const bookingId = parseInt(req.params.id, 10);
            if (isNaN(bookingId)) {
                const response = {
                    success: false,
                    message: 'Invalid booking ID',
                    error: 'Booking ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            await booking_service_1.BookingService.deleteBooking(bookingId);
            const response = {
                success: true,
                message: 'Booking deleted successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ BookingController.deleteBooking error:', error.message);
            const response = {
                success: false,
                message: 'Failed to delete booking',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
}
exports.BookingController = BookingController;
