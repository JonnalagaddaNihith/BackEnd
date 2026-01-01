import { Router } from 'express';
import { AuthController } from '../Controllers/auth.controller';
import {
  validateUserRegistration,
  validateUserLogin,
} from '../Middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateUserRegistration, AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateUserLogin, AuthController.login);

export default router;
