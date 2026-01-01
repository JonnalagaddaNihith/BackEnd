import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executeQuery } from '../Config/db.config';
import { formatDateForDB, rowExists } from '../Config/utils';
import {
  Booking,
  BookingCreateDTO,
  BookingUpdateStatusDTO,
  BookingResponseDTO,
} from '../Models/Booking';

export class BookingService {
  // Helper method to check if two date ranges overlap 
  private static checkDateOverlap(
    start1: Date | string,
    end1: Date | string,
    start2: Date | string,
    end2: Date | string
  ): boolean {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);

    return (
      (s1 <= e2 && e1 >= s2) || // Overlap case 1
      (s2 <= e1 && e2 >= s1)    // Overlap case 2
    );
  }

  static async createBooking(bookingData: BookingCreateDTO): Promise<BookingResponseDTO> {
    try {
      // Check if property exists
      const [property] = await executeQuery<RowDataPacket[]>(
        'SELECT id, owner_id FROM Properties WHERE id = ?',
        [bookingData.property_id]
      );

      if (!property) {
        throw new Error('Property not found');
      }
      const approvedConflicts = await executeQuery<RowDataPacket[]>(
        `SELECT id FROM Bookings 
         WHERE property_id = ? 
         AND status = 'Approved'
         AND (
           (check_in <= ? AND check_out >= ?) OR
           (check_in <= ? AND check_out >= ?) OR
           (check_in >= ? AND check_out <= ?)
         )`,
        [
          bookingData.property_id,
          formatDateForDB(bookingData.check_out),
          formatDateForDB(bookingData.check_in),
          formatDateForDB(bookingData.check_in),
          formatDateForDB(bookingData.check_in),
          formatDateForDB(bookingData.check_in),
          formatDateForDB(bookingData.check_out),
        ]
      );

      if (rowExists(approvedConflicts)) {
        throw new Error('Property is already booked for the selected dates');
      }
      const result = await executeQuery<ResultSetHeader>(
        `INSERT INTO Bookings (property_id, tenant_id, check_in, check_out, status) 
         VALUES (?, ?, ?, ?, 'Pending')`,
        [
          bookingData.property_id,
          bookingData.tenant_id,
          formatDateForDB(bookingData.check_in),
          formatDateForDB(bookingData.check_out),
        ]
      );

      return await this.getBookingById(result.insertId);
    } catch (error: any) {
      console.error('❌ BookingService.createBooking error:', error.message);
      throw error;
    }
  }

// Get booking by ID with property and tenant details Using Joins
  static async getBookingById(bookingId: number): Promise<BookingResponseDTO> {
    try {
      const [booking] = await executeQuery<RowDataPacket[]>(
        `SELECT 
           b.*,
           p.title as property_title,
           p.location as property_location,
           p.rent_per_day as property_rent_per_day,
           p.owner_id,
           u.name as tenant_name,
           u.email as tenant_email
         FROM Bookings b
         JOIN Properties p ON b.property_id = p.id
         JOIN Users u ON b.tenant_id = u.id
         WHERE b.id = ?`,
        [bookingId]
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        id: booking.id,
        property_id: booking.property_id,
        tenant_id: booking.tenant_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        request_time: booking.request_time,
        property_title: booking.property_title,
        property_location: booking.property_location,
        property_rent_per_day: booking.property_rent_per_day,
        tenant_name: booking.tenant_name,
        tenant_email: booking.tenant_email,
        owner_id: booking.owner_id,
      };
    } catch (error: any) {
      console.error('❌ BookingService.getBookingById error:', error.message);
      throw error;
    }
  }

  static async getBookingsByTenant(tenantId: number): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await executeQuery<RowDataPacket[]>(
        `SELECT 
           b.*,
           p.title as property_title,
           p.location as property_location,
           p.rent_per_day as property_rent_per_day,
           p.owner_id,
           u.name as tenant_name,
           u.email as tenant_email
         FROM Bookings b
         JOIN Properties p ON b.property_id = p.id
         JOIN Users u ON b.tenant_id = u.id
         WHERE b.tenant_id = ?
         ORDER BY b.request_time DESC`,
        [tenantId]
      );

      return bookings.map((booking) => ({
        id: booking.id,
        property_id: booking.property_id,
        tenant_id: booking.tenant_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        request_time: booking.request_time,
        property_title: booking.property_title,
        property_location: booking.property_location,
        property_rent_per_day: booking.property_rent_per_day,
        tenant_name: booking.tenant_name,
        tenant_email: booking.tenant_email,
        owner_id: booking.owner_id,
      }));
    } catch (error: any) {
      console.error('❌ BookingService.getBookingsByTenant error:', error.message);
      throw error;
    }
  }

  static async getBookingsByOwner(ownerId: number): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await executeQuery<RowDataPacket[]>(
        `SELECT 
           b.*,
           p.title as property_title,
           p.location as property_location,
           p.rent_per_day as property_rent_per_day,
           p.owner_id,
           u.name as tenant_name,
           u.email as tenant_email
         FROM Bookings b
         JOIN Properties p ON b.property_id = p.id
         JOIN Users u ON b.tenant_id = u.id
         WHERE p.owner_id = ?
         ORDER BY b.request_time DESC`,
        [ownerId]
      );

      return bookings.map((booking) => ({
        id: booking.id,
        property_id: booking.property_id,
        tenant_id: booking.tenant_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        request_time: booking.request_time,
        property_title: booking.property_title,
        property_location: booking.property_location,
        property_rent_per_day: booking.property_rent_per_day,
        tenant_name: booking.tenant_name,
        tenant_email: booking.tenant_email,
        owner_id: booking.owner_id,
      }));
    } catch (error: any) {
      console.error('❌ BookingService.getBookingsByOwner error:', error.message);
      throw error;
    }
  }

// (Admin only)
  static async getAllBookings(): Promise<BookingResponseDTO[]> {
    try {
      const bookings = await executeQuery<RowDataPacket[]>(
        `SELECT 
           b.*,
           p.title as property_title,
           p.location as property_location,
           p.rent_per_day as property_rent_per_day,
           p.owner_id,
           u.name as tenant_name,
           u.email as tenant_email
         FROM Bookings b
         JOIN Properties p ON b.property_id = p.id
         JOIN Users u ON b.tenant_id = u.id
         ORDER BY b.request_time DESC`
      );

      return bookings.map((booking) => ({
        id: booking.id,
        property_id: booking.property_id,
        tenant_id: booking.tenant_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
        request_time: booking.request_time,
        property_title: booking.property_title,
        property_location: booking.property_location,
        property_rent_per_day: booking.property_rent_per_day,
        tenant_name: booking.tenant_name,
        tenant_email: booking.tenant_email,
        owner_id: booking.owner_id,
      }));
    } catch (error: any) {
      console.error('❌ BookingService.getAllBookings error:', error.message);
      throw error;
    }
  }

  /**
   * Update booking status (Owner only)
   * When approving: auto-rejects all other pending bookings with overlapping dates
   * Prevents approving if it would conflict with existing approved bookings
   */
  static async updateBookingStatus(
    bookingId: number,
    ownerId: number,
    statusUpdate: BookingUpdateStatusDTO
  ): Promise<BookingResponseDTO> {
    try {
      // Check if booking exists and belongs to owner's property
      const [booking] = await executeQuery<RowDataPacket[]>(
        `SELECT b.*, p.owner_id 
         FROM Bookings b
         JOIN Properties p ON b.property_id = p.id
         WHERE b.id = ? AND p.owner_id = ?`,
        [bookingId, ownerId]
      );

      if (!booking) {
        throw new Error('Booking not found or you do not have permission to update it');
      }

      // If approving, check for conflicts with other approved bookings
      if (statusUpdate.status === 'Approved') {
        const approvedConflicts = await executeQuery<RowDataPacket[]>(
          `SELECT id FROM Bookings 
           WHERE property_id = ? 
           AND id != ?
           AND status = 'Approved'
           AND (
             (check_in <= ? AND check_out >= ?) OR
             (check_in <= ? AND check_out >= ?) OR
             (check_in >= ? AND check_out <= ?)
           )`,
          [
            booking.property_id,
            bookingId,
            booking.check_out,
            booking.check_in,
            booking.check_in,
            booking.check_in,
            booking.check_in,
            booking.check_out,
          ]
        );

        if (rowExists(approvedConflicts)) {
          throw new Error(
            'Cannot approve: This booking conflicts with an already approved booking for these dates'
          );
        }

        // Auto-reject all other pending bookings with overlapping dates
        const pendingConflicts = await executeQuery<RowDataPacket[]>(
          `SELECT id, check_in, check_out FROM Bookings 
           WHERE property_id = ? 
           AND id != ?
           AND status = 'Pending'
           AND (
             (check_in <= ? AND check_out >= ?) OR
             (check_in <= ? AND check_out >= ?) OR
             (check_in >= ? AND check_out <= ?)
           )`,
          [
            booking.property_id,
            bookingId,
            booking.check_out,
            booking.check_in,
            booking.check_in,
            booking.check_in,
            booking.check_in,
            booking.check_out,
          ]
        );

        // Reject all conflicting pending bookings
        if (pendingConflicts.length > 0) {
          const conflictIds = pendingConflicts.map((b) => b.id);
          await executeQuery(
            `UPDATE Bookings SET status = 'Rejected' WHERE id IN (${conflictIds.join(',')})`,
            []
          );
          console.log(
            `✅ Auto-rejected ${conflictIds.length} conflicting pending booking(s): [${conflictIds.join(', ')}]`
          );
        }
      }
      await executeQuery(
        'UPDATE Bookings SET status = ? WHERE id = ?',
        [statusUpdate.status, bookingId]
      );

      return await this.getBookingById(bookingId);
    } catch (error: any) {
      console.error('❌ BookingService.updateBookingStatus error:', error.message);
      throw error;
    }
  }

// Cancel booking (Tenant only, only if status is Pending)
  static async cancelBooking(bookingId: number, tenantId: number): Promise<void> {
    try {
      const [booking] = await executeQuery<RowDataPacket[]>(
        'SELECT * FROM Bookings WHERE id = ? AND tenant_id = ?',
        [bookingId, tenantId]
      );

      if (!booking) {
        throw new Error('Booking not found or you do not have permission to cancel it');
      }

      if (booking.status !== 'Pending') {
        throw new Error('Only pending bookings can be cancelled');
      }

      const result = await executeQuery<ResultSetHeader>(
        'DELETE FROM Bookings WHERE id = ? AND tenant_id = ?',
        [bookingId, tenantId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('❌ BookingService.cancelBooking error:', error.message);
      throw error;
    }
  }

// Delete booking (Admin only)
  static async deleteBooking(bookingId: number): Promise<void> {
    try {
      const result = await executeQuery<ResultSetHeader>(
        'DELETE FROM Bookings WHERE id = ?',
        [bookingId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Booking not found');
      }
    } catch (error: any) {
      console.error('❌ BookingService.deleteBooking error:', error.message);
      throw error;
    }
  }
}
