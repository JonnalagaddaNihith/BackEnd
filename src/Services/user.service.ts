import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executeQuery } from '../Config/db.config';
import { rowExists, isValidEmail } from '../Config/utils';
import {
  User,
  UserRegistrationDTO,
  UserLoginDTO,
  UserResponseDTO,
} from '../Models/User';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

export class UserService {
// Register a new user
  static async register(userData: UserRegistrationDTO): Promise<UserResponseDTO> {
    try {
      const existingUser = await executeQuery<RowDataPacket[]>(
        'SELECT id FROM Users WHERE email = ?',
        [userData.email]
      );

      if (rowExists(existingUser)) {
        throw new Error('User with this email already exists');
      }

      // Encrypting password
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
      const result = await executeQuery<ResultSetHeader>(
        `INSERT INTO Users (name, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        [userData.name, userData.email, hashedPassword, userData.role]
      );
      const [newUser] = await executeQuery<RowDataPacket[]>(
        'SELECT id, name, email, role, created_at FROM Users WHERE id = ?',
        [result.insertId]
      );

      return newUser as UserResponseDTO;
    } catch (error: any) {
      console.error('❌ UserService.register error:', error.message);
      throw error;
    }
  }

  // Login user and return JWT token
  static async login(credentials: UserLoginDTO): Promise<{
    user: UserResponseDTO;
    token: string;
  }> {
    try {
      const [user] = await executeQuery<RowDataPacket[]>(
        'SELECT * FROM Users WHERE email = ?',
        [credentials.email]
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '30d';

      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        jwtSecret as jwt.Secret,
        { expiresIn: jwtExpiresIn } as jwt.SignOptions
      );
      const userResponse: UserResponseDTO = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      };

      return { user: userResponse, token };
    } catch (error: any) {
      console.error('❌ UserService.login error:', error.message);
      throw error;
    }
  }


  static async getUserById(userId: number): Promise<UserResponseDTO> {
    try {
      const [user] = await executeQuery<RowDataPacket[]>(
        'SELECT id, name, email, role, created_at FROM Users WHERE id = ?',
        [userId]
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user as UserResponseDTO;
    } catch (error: any) {
      console.error('❌ UserService.getUserById error:', error.message);
      throw error;
    }
  }

// Admin only
  static async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const users = await executeQuery<RowDataPacket[]>(
        'SELECT id, name, email, role, created_at FROM Users ORDER BY created_at DESC'
      );

      return users as UserResponseDTO[];
    } catch (error: any) {
      console.error('❌ UserService.getAllUsers error:', error.message);
      throw error;
    }
  }

  static async updateUser(
    userId: number,
    updates: Partial<{ name: string; email: string }>
  ): Promise<UserResponseDTO> {
    try {
      const existingUser = await this.getUserById(userId);
      if (updates.email && updates.email !== existingUser.email) {
        const emailCheck = await executeQuery<RowDataPacket[]>(
          'SELECT id FROM Users WHERE email = ? AND id != ?',
          [updates.email, userId]
        );

        if (rowExists(emailCheck)) {
          throw new Error('Email is already in use');
        }
      }
      const updateFields: string[] = [];
      const updateValues: any[] = [];

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

      await executeQuery(
        `UPDATE Users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
      return await this.getUserById(userId);
    } catch (error: any) {
      console.error('❌ UserService.updateUser error:', error.message);
      throw error;
    }
  }

  static async deleteUser(userId: number): Promise<void> {
    try {
      const result = await executeQuery<ResultSetHeader>(
        'DELETE FROM Users WHERE id = ?',
        [userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
    } catch (error: any) {
      console.error('❌ UserService.deleteUser error:', error.message);
      throw error;
    }
  }
}
