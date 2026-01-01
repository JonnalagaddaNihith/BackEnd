import { Request, Response } from 'express';
import { AuthRequest } from '../Middleware/auth.middleware';
import { PropertyService } from '../Services/property.service';
import { ApiResponse } from '../Models/Response';
import { PropertyCreateDTO, PropertyUpdateDTO, PropertyFilterDTO } from '../Models/Property';

export class PropertyController {
  static async createProperty(req: AuthRequest, res: Response): Promise<void> {
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

      const propertyData: PropertyCreateDTO = {
        ...req.body,
        owner_id: req.user.id,
      };

      const property = await PropertyService.createProperty(propertyData);

      const response: ApiResponse = {
        success: true,
        message: 'Property created successfully',
        data: property,
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.createProperty error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create property',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async getAllProperties(req: Request, res: Response): Promise<void> {
    try {
      const filters: PropertyFilterDTO = {
        location: req.query.location as string,
        min_rent: req.query.min_rent ? parseFloat(req.query.min_rent as string) : undefined,
        max_rent: req.query.max_rent ? parseFloat(req.query.max_rent as string) : undefined,
        amenities: req.query.amenities as string,
      };

      const properties = await PropertyService.getAllProperties(filters);

      const response: ApiResponse = {
        success: true,
        message: 'Properties retrieved successfully',
        data: properties,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.getAllProperties error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve properties',
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  static async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = parseInt(req.params.id, 10);

      if (isNaN(propertyId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid property ID',
          error: 'Property ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      const property = await PropertyService.getPropertyById(propertyId);

      const response: ApiResponse = {
        success: true,
        message: 'Property retrieved successfully',
        data: property,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.getPropertyById error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve property',
        error: error.message,
      };
      res.status(404).json(response);
    }
  }

  static async getMyProperties(req: AuthRequest, res: Response): Promise<void> {
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

      const properties = await PropertyService.getPropertiesByOwner(req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Your properties retrieved successfully',
        data: properties,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.getMyProperties error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve your properties',
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  static async updateProperty(req: AuthRequest, res: Response): Promise<void> {
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

      const propertyId = parseInt(req.params.id, 10);

      if (isNaN(propertyId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid property ID',
          error: 'Property ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      const updates: PropertyUpdateDTO = req.body;

      const property = await PropertyService.updateProperty(
        propertyId,
        req.user.id,
        updates
      );

      const response: ApiResponse = {
        success: true,
        message: 'Property updated successfully',
        data: property,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.updateProperty error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update property',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async deleteProperty(req: AuthRequest, res: Response): Promise<void> {
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

      const propertyId = parseInt(req.params.id, 10);

      if (isNaN(propertyId)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid property ID',
          error: 'Property ID must be a number',
        };
        res.status(400).json(response);
        return;
      }

      await PropertyService.deleteProperty(propertyId, req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Property deleted successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error('❌ PropertyController.deleteProperty error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete property',
        error: error.message,
      };
      res.status(404).json(response);
    }
  }
}
