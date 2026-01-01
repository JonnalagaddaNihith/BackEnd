import { Request, Response } from 'express';
import { AdminService } from '../Services/admin.service';

export class AdminController {
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      console.error('❌ AdminController.getAnalytics error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics'
      });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await AdminService.getAllUsersWithStats();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error: any) {
      console.error('❌ AdminController.getAllUsers error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  static async getAllProperties(req: Request, res: Response): Promise<void> {
    try {
      const properties = await AdminService.getAllPropertiesForAdmin();
      res.status(200).json({
        success: true,
        data: properties
      });
    } catch (error: any) {
      console.error('❌ AdminController.getAllProperties error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch properties'
      });
    }
  }

  static async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = parseInt(req.params.id, 10);

      if (isNaN(propertyId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid property ID'
        });
        return;
      }

      await AdminService.deletePropertyByAdmin(propertyId);
      res.status(200).json({
        success: true,
        message: 'Property deleted successfully'
      });
    } catch (error: any) {
      console.error('❌ AdminController.deleteProperty error:', error.message);
      if (error.message === 'Property not found') {
        res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete property'
        });
      }
    }
  }
}
