import { RowDataPacket } from 'mysql2';
import { executeQuery } from '../Config/db.config';
import { AdminAnalytics } from '../Models/admin';
import { bufferToBase64 } from '../Config/utils';

export class AdminService {
  static async getAnalytics(): Promise<AdminAnalytics> {
    try {
      const userStats = await executeQuery<RowDataPacket[]>(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN role = 'tenant' THEN 1 ELSE 0 END) as tenants,
           SUM(CASE WHEN role = 'owner' THEN 1 ELSE 0 END) as owners
         FROM Users WHERE role != 'admin'`
      );

      const [propertyStats] = await executeQuery<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM Properties`
      );

      const [bookingStats] = await executeQuery<RowDataPacket[]>(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
           SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
         FROM Bookings`
      );
      const recentUsers = await executeQuery<RowDataPacket[]>(
        `SELECT id, name, email, role, created_at 
         FROM Users 
         WHERE role != 'admin'
         ORDER BY created_at DESC 
         LIMIT 10`
      );
      const topOwners = await executeQuery<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, COUNT(p.id) as propertyCount
         FROM Users u
         LEFT JOIN Properties p ON u.id = p.owner_id
         WHERE u.role = 'owner'
         GROUP BY u.id, u.name, u.email
         ORDER BY propertyCount DESC
         LIMIT 5`
      );
      const topTenants = await executeQuery<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, COUNT(b.id) as bookingCount
         FROM Users u
         LEFT JOIN Bookings b ON u.id = b.tenant_id
         WHERE u.role = 'tenant'
         GROUP BY u.id, u.name, u.email
         ORDER BY bookingCount DESC
         LIMIT 5`
      );

      return {
        totalUsers: userStats[0]?.total || 0,
        totalTenants: userStats[0]?.tenants || 0,
        totalOwners: userStats[0]?.owners || 0,
        totalProperties: propertyStats?.total || 0,
        totalBookings: bookingStats?.total || 0,
        pendingBookings: bookingStats?.pending || 0,
        approvedBookings: bookingStats?.approved || 0,
        rejectedBookings: bookingStats?.rejected || 0,
        recentUsers: recentUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          created_at: u.created_at
        })),
        topOwners: topOwners.map(o => ({
          id: o.id,
          name: o.name,
          email: o.email,
          propertyCount: o.propertyCount
        })),
        topTenants: topTenants.map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          bookingCount: t.bookingCount
        }))
      };
    } catch (error: any) {
      console.error('❌ AdminService.getAnalytics error:', error.message);
      throw error;
    }
  }

  static async getAllUsersWithStats(): Promise<any[]> {
    try {
      const users = await executeQuery<RowDataPacket[]>(
        `SELECT 
           u.id, u.name, u.email, u.role, u.created_at,
           CASE 
             WHEN u.role = 'owner' THEN (SELECT COUNT(*) FROM Properties p WHERE p.owner_id = u.id)
             ELSE 0
           END as propertyCount,
           CASE 
             WHEN u.role = 'tenant' THEN (SELECT COUNT(*) FROM Bookings b WHERE b.tenant_id = u.id)
             WHEN u.role = 'owner' THEN (SELECT COUNT(*) FROM Bookings b JOIN Properties p ON b.property_id = p.id WHERE p.owner_id = u.id)
             ELSE 0
           END as bookingCount
         FROM Users u
         WHERE u.role != 'admin'
         ORDER BY u.created_at DESC`
      );

      return users;
    } catch (error: any) {
      console.error('❌ AdminService.getAllUsersWithStats error:', error.message);
      throw error;
    }
  }

  static async getAllPropertiesForAdmin(): Promise<any[]> {
    try {
      const properties = await executeQuery<RowDataPacket[]>(
        `SELECT 
           p.*,
           u.name as owner_name,
           u.email as owner_email,
           (SELECT COUNT(*) FROM Bookings b WHERE b.property_id = p.id) as bookingCount,
           (SELECT COUNT(*) FROM Bookings b WHERE b.property_id = p.id AND b.status = 'Approved') as approvedBookings
         FROM Properties p
         JOIN Users u ON p.owner_id = u.id
         ORDER BY p.id DESC`
      );

      return properties.map(property => ({
        ...property,
        photo1: bufferToBase64(property.photo1),
        photo2: bufferToBase64(property.photo2),
        photo3: bufferToBase64(property.photo3),
        photo4: bufferToBase64(property.photo4),
      }));
    } catch (error: any) {
      console.error('❌ AdminService.getAllPropertiesForAdmin error:', error.message);
      throw error;
    }
  }

  static async deletePropertyByAdmin(propertyId: number): Promise<void> {
    try {
      await executeQuery(
        'DELETE FROM Bookings WHERE property_id = ?',
        [propertyId]
      );

      const result = await executeQuery<any>(
        'DELETE FROM Properties WHERE id = ?',
        [propertyId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Property not found');
      }
    } catch (error: any) {
      console.error('❌ AdminService.deletePropertyByAdmin error:', error.message);
      throw error;
    }
  }
}
