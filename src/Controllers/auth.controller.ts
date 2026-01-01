import { Request, Response } from 'express';
import { UserService } from '../Services/user.service';
import { ApiResponse, AuthResponse } from '../Models/Response';
import { UserRegistrationDTO, UserLoginDTO } from '../Models/User';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserRegistrationDTO = req.body;

      const user = await UserService.register(userData);

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: user,
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('❌ AuthController.register error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Registration failed',
        error: error.message,
      };
      res.status(400).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: UserLoginDTO = req.body;

      const { user, token } = await UserService.login(credentials);

      const response: AuthResponse = {
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
    } catch (error: any) {
      console.error('❌ AuthController.login error:', error.message);
      const response: ApiResponse = {
        success: false,
        message: 'Login failed',
        error: error.message,
      };
      res.status(401).json(response);
    }
  }
}
