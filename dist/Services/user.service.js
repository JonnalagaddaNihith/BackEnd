"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = require("../Config/db.config");
const utils_1 = require("../Config/utils");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);
class UserService {
    // Register a new user
    static async register(userData) {
        try {
            const existingUser = await (0, db_config_1.executeQuery)('SELECT id FROM Users WHERE email = ?', [userData.email]);
            if ((0, utils_1.rowExists)(existingUser)) {
                throw new Error('User with this email already exists');
            }
            // Encrypting password
            const hashedPassword = await bcrypt_1.default.hash(userData.password, SALT_ROUNDS);
            const result = await (0, db_config_1.executeQuery)(`INSERT INTO Users (name, email, password, role) 
         VALUES (?, ?, ?, ?)`, [userData.name, userData.email, hashedPassword, userData.role]);
            const [newUser] = await (0, db_config_1.executeQuery)('SELECT id, name, email, role, created_at FROM Users WHERE id = ?', [result.insertId]);
            return newUser;
        }
        catch (error) {
            console.error('❌ UserService.register error:', error.message);
            throw error;
        }
    }
    // Login user and return JWT token
    static async login(credentials) {
        try {
            const [user] = await (0, db_config_1.executeQuery)('SELECT * FROM Users WHERE email = ?', [credentials.email]);
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const isPasswordValid = await bcrypt_1.default.compare(credentials.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            const jwtSecret = process.env.JWT_SECRET;
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '30d';
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not configured');
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            }, jwtSecret, { expiresIn: jwtExpiresIn });
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            };
            return { user: userResponse, token };
        }
        catch (error) {
            console.error('❌ UserService.login error:', error.message);
            throw error;
        }
    }
    static async getUserById(userId) {
        try {
            const [user] = await (0, db_config_1.executeQuery)('SELECT id, name, email, role, created_at FROM Users WHERE id = ?', [userId]);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            console.error('❌ UserService.getUserById error:', error.message);
            throw error;
        }
    }
    // Admin only
    static async getAllUsers() {
        try {
            const users = await (0, db_config_1.executeQuery)('SELECT id, name, email, role, created_at FROM Users ORDER BY created_at DESC');
            return users;
        }
        catch (error) {
            console.error('❌ UserService.getAllUsers error:', error.message);
            throw error;
        }
    }
    static async updateUser(userId, updates) {
        try {
            const existingUser = await this.getUserById(userId);
            if (updates.email && updates.email !== existingUser.email) {
                const emailCheck = await (0, db_config_1.executeQuery)('SELECT id FROM Users WHERE email = ? AND id != ?', [updates.email, userId]);
                if ((0, utils_1.rowExists)(emailCheck)) {
                    throw new Error('Email is already in use');
                }
            }
            const updateFields = [];
            const updateValues = [];
            if (updates.name) {
                updateFields.push('name = ?');
                updateValues.push(updates.name);
            }
            if (updates.email) {
                updateFields.push('email = ?');
                updateValues.push(updates.email);
            }
            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }
            updateValues.push(userId);
            await (0, db_config_1.executeQuery)(`UPDATE Users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
            return await this.getUserById(userId);
        }
        catch (error) {
            console.error('❌ UserService.updateUser error:', error.message);
            throw error;
        }
    }
    static async deleteUser(userId) {
        try {
            const result = await (0, db_config_1.executeQuery)('DELETE FROM Users WHERE id = ?', [userId]);
            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }
        }
        catch (error) {
            console.error('❌ UserService.deleteUser error:', error.message);
            throw error;
        }
    }
}
exports.UserService = UserService;
