"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../Services/user.service");
class AuthController {
    static async register(req, res) {
        try {
            const userData = req.body;
            const user = await user_service_1.UserService.register(userData);
            const response = {
                success: true,
                message: 'User registered successfully',
                data: user,
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ AuthController.register error:', error.message);
            const response = {
                success: false,
                message: 'Registration failed',
                error: error.message,
            };
            res.status(400).json(response);
        }
    }
    static async login(req, res) {
        try {
            const credentials = req.body;
            const { user, token } = await user_service_1.UserService.login(credentials);
            const response = {
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                },
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ AuthController.login error:', error.message);
            const response = {
                success: false,
                message: 'Login failed',
                error: error.message,
            };
            res.status(401).json(response);
        }
    }
}
exports.AuthController = AuthController;
