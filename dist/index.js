"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./Config/db.config");
const Routes_1 = __importDefault(require("./Routes"));
const error_middleware_1 = require("./Middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '/api';
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
});
app.use(BASE_URL, Routes_1.default);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'RentEasy API',
        version: '1.0.0',
        endpoints: {
            health: `${BASE_URL}/health`,
            auth: `${BASE_URL}/auth`,
            users: `${BASE_URL}/users`,
            properties: `${BASE_URL}/properties`,
            bookings: `${BASE_URL}/bookings`,
        },
    });
});
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    try {
        console.log('🔄 Testing database connection...');
        await (0, db_config_1.testConnection)();
        app.listen(PORT, () => {
            console.log('🏠 RentEasy');
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📍 Base API URL: http://localhost:${PORT}${BASE_URL}`);
            console.log(`🏥 Health Check: http://localhost:${PORT}${BASE_URL}/health`);
            console.log('📚 Available Endpoints:');
            console.log(`   • POST   ${BASE_URL}/auth/register`);
            console.log(`   • POST   ${BASE_URL}/auth/login`);
            console.log(`   • GET    ${BASE_URL}/users/profile`);
            console.log(`   • GET    ${BASE_URL}/properties`);
            console.log(`   • POST   ${BASE_URL}/properties`);
            console.log(`   • GET    ${BASE_URL}/properties/:id`);
            console.log(`   • POST   ${BASE_URL}/bookings`);
            console.log(`   • GET    ${BASE_URL}/bookings/tenant/me`);
            console.log(`   • GET    ${BASE_URL}/bookings/owner/me`);
            console.log(`   • PATCH  ${BASE_URL}/bookings/:id/status`);
            console.log('✅ All systems operational!');
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('Please check your database configuration and ensure MySQL is running.');
        process.exit(1);
    }
};
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
});
startServer();
