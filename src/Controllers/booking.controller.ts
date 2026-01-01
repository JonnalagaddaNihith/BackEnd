import { Response } from 'express';
import { AuthRequest } from '../Middleware/auth.middleware';
import { BookingService } from '../Services/booking.service';
import { ApiResponse } from '../Models/Response';
import { BookingCreateDTO, BookingUpdateStatusDTO } from '../Models/Booking';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'User information not found',
        };
        res.status(401).json(response);
        return;
      }

      const bookingData: BookingCreateDTO = {
        ...req.body,
        tenant_id: req.user.id,
      };

      const booking = await BookingService.createBooking(bookingData);

      const response: ApiResponse = {
        success: true,
        message: 'Booking request submitted successfully',
        data: booking,
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.createBooking error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create booking',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingId = parseInt(req.params.id, 10);

      if (isNaN(bookingId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid booking ID',
          error: 'Booking ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      const booking = await BookingService.getBookingById(bookingId);
      if (req.user) {
        const canView =
          req.user.role === 'Admin' ||
          booking.tenant_id === req.user.id ||
          booking.owner_id === req.user.id;

        if (!canView) {
          const response: ApiResponse = {
            success: false,
            message: 'Access denied',
            error: 'You do not have permission to view this booking',
          };
          res.status(403).json(response);
          return;
        }
      }

      const response: ApiResponse = {
        success: true,
        message: 'Booking retrieved successfully',
        data: booking,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.getBookingById error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve booking',
        error: error.message,
      };
      res.status(404).json(response);
    }
  }

  static async getMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'User information not found',
        };
        res.status(401).json(response);
        return;
      }

      const bookings = await BookingService.getBookingsByTenant(req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Your bookings retrieved successfully',
        data: bookings,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.getMyBookings error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve your bookings',
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  static async getBookingsForMyProperties(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'User information not found',
        };
        res.status(401).json(response);
        return;
      }

      const bookings = await BookingService.getBookingsByOwner(req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Bookings for your properties retrieved successfully',
        data: bookings,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.getBookingsForMyProperties error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve bookings for your properties',
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  static async getAllBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookings = await BookingService.getAllBookings();

      const response: ApiResponse = {
        success: true,
        message: 'All bookings retrieved successfully',
        data: bookings,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.getAllBookings error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve bookings',
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  static async updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'User information not found',
        };
        res.status(401).json(response);
        return;
      }

      const bookingId = parseInt(req.params.id, 10);

      if (isNaN(bookingId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid booking ID',
          error: 'Booking ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      const statusUpdate: BookingUpdateStatusDTO = { status: req.body.status };

      const booking = await BookingService.updateBookingStatus(
        bookingId,
        req.user.id,
        statusUpdate
      );

      const response: ApiResponse = {
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.updateBookingStatus error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update booking status',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'User information not found',
        };
        res.status(401).json(response);
        return;
      }

      const bookingId = parseInt(req.params.id, 10);

      if (isNaN(bookingId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid booking ID',
          error: 'Booking ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      await BookingService.cancelBooking(bookingId, req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Booking cancelled successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.cancelBooking error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to cancel booking',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async deleteBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookingId = parseInt(req.params.id, 10);

      if (isNaN(bookingId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid booking ID',
          error: 'Booking ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      await BookingService.deleteBooking(bookingId);

      const response: ApiResponse = {
        success: true,
        message: 'Booking deleted successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ BookingController.deleteBooking error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete booking',
        error: error.message,
      };
      res.status(404).json(response);
    }
  }
}
