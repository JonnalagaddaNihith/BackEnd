"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../Services/admin.service");
class AdminController {
    static async getAnalytics(req, res) {
        try {
            const analytics = await admin_service_1.AdminService.getAnalytics();
            res.status(200).json({
                success: true,
                data: analytics
            });
        }
        catch (error) {
            console.error('❌ AdminController.getAnalytics error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch analytics'
            });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await admin_service_1.AdminService.getAllUsersWithStats();
            res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            console.error('❌ AdminController.getAllUsers error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    }
    static async getAllProperties(req, res) {
        try {
            const properties = await admin_service_1.AdminService.getAllPropertiesForAdmin();
            res.status(200).json({
                success: true,
                data: properties
            });
        }
        catch (error) {
            console.error('❌ AdminController.getAllProperties error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch properties'
            });
        }
    }
    static async deleteProperty(req, res) {
        try {
            const propertyId = parseInt(req.params.id, 10);
            if (isNaN(propertyId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid property ID'
                });
                return;
            }
            await admin_service_1.AdminService.deletePropertyByAdmin(propertyId);
            res.status(200).json({
                success: true,
                message: 'Property deleted successfully'
            });
        }
        catch (error) {
            console.error('❌ AdminController.deleteProperty error:', error.message);
            if (error.message === 'Property not found') {
                res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete property'
                });
            }
        }
    }
}
exports.AdminController = AdminController;
