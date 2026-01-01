"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../Controllers/auth.controller");
const validation_middleware_1 = require("../Middleware/validation.middleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validation_middleware_1.validateUserRegistration, auth_controller_1.AuthController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validation_middleware_1.validateUserLogin, auth_controller_1.AuthController.login);
exports.default = router;
