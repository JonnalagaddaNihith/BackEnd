"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../Services/user.service");
class UserController {
    static async getProfile(req, res) {
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
            const user = await user_service_1.UserService.getUserById(req.user.id);
            const response = {
                success: true,
                message: 'User profile retrieved successfully',
                data: user,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ UserController.getProfile error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve user profile',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
    static async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                const response = {
                    success: false,
                    message: 'Invalid user ID',
                    error: 'User ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            const user = await user_service_1.UserService.getUserById(userId);
            const response = {
                success: true,
                message: 'User retrieved successfully',
                data: user,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ UserController.getUserById error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve user',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
    // Admin Only
    static async getAllUsers(req, res) {
        try {
            const users = await user_service_1.UserService.getAllUsers();
            const response = {
                success: true,
                message: 'Users retrieved successfully',
                data: users,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ UserController.getAllUsers error:', error.message);
            const response = {
                success: false,
                message: 'Failed to retrieve users',
                error: error.message,
            };
            res.status(500).json(response);
        }
    }
    static async updateProfile(req, res) {
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
            const { name, email } = req.body;
            const updatedUser = await user_service_1.UserService.updateUser(req.user.id, { name, email });
            const response = {
                success: true,
                message: 'User profile updated successfully',
                data: updatedUser,
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ UserController.updateProfile error:', error.message);
            const response = {
                success: false,
                message: 'Failed to update user profile',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    // Admin Only
    static async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                const response = {
                    success: false,
                    message: 'Invalid user ID',
                    error: 'User ID must be a number',
                };
                res.status(400).json(response);
                return;
            }
            await user_service_1.UserService.deleteUser(userId);
            const response = {
                success: true,
                message: 'User deleted successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ UserController.deleteUser error:', error.message);
            const response = {
                success: false,
                message: 'Failed to delete user',
                error: error.message,
            };
            res.status(404).json(response);
        }
    }
}
exports.UserController = UserController;
