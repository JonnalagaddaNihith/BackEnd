"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const property_service_1 = require("../Services/property.service");
class PropertyController {
    static async createProperty(req, res) {
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
            const propertyData = {
                ...req.body,
                owner_id: req.user.id,
            };
            const property = await property_service_1.PropertyService.createProperty(propertyData);
            const response = {
                success: true,
                message: 'Property created successfully',
                data: property,
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.createProperty error:', error.message);
            const response = {
                success: false,
                message: 'Failed to create property',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async getAllProperties(req, res) {
        try {
            const filters = {
                location: req.query.location,
                min_rent: req.query.min_rent ? parseFloat(req.query.min_rent) : undefined,
                max_rent: req.query.max_rent ? parseFloat(req.query.max_rent) : undefined,
                amenities: req.query.amenities,
            };
            const properties = await property_service_1.PropertyService.getAllProperties(filters);
            const response = {
                success: true,
                message: 'Properties retrieved successfully',
                data: properties,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.getAllProperties error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve properties',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async getPropertyById(req, res) {
        try {
            const propertyId = parseInt(req.params.id, 10);
            if (isNaN(propertyId)) {
                const response = {
                    success: false,
                    message: 'Invalid property ID',
                    error: 'Property ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            const property = await property_service_1.PropertyService.getPropertyById(propertyId);
            const response = {
                success: true,
                message: 'Property retrieved successfully',
                data: property,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.getPropertyById error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve property',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
    static async getMyProperties(req, res) {
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
            const properties = await property_service_1.PropertyService.getPropertiesByOwner(req.user.id);
            const response = {
                success: true,
                message: 'Your properties retrieved successfully',
                data: properties,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.getMyProperties error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve your properties',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async updateProperty(req, res) {
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
            const propertyId = parseInt(req.params.id, 10);
            if (isNaN(propertyId)) {
                const response = {
                    success: false,
                    message: 'Invalid property ID',
                    error: 'Property ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            const updates = req.body;
            const property = await property_service_1.PropertyService.updateProperty(propertyId, req.user.id, updates);
            const response = {
                success: true,
                message: 'Property updated successfully',
                data: property,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.updateProperty error:', error.message);
            const response = {
                success: false,
                message: 'Failed to update property',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async deleteProperty(req, res) {
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
            const propertyId = parseInt(req.params.id, 10);
            if (isNaN(propertyId)) {
                const response = {
                    success: false,
                    message: 'Invalid property ID',
                    error: 'Property ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            await property_service_1.PropertyService.deleteProperty(propertyId, req.user.id);
            const response = {
                success: true,
                message: 'Property deleted successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ PropertyController.deleteProperty error:', error.message);
            const response = {
                success: false,
                message: 'Failed to delete property',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
}
exports.PropertyController = PropertyController;
