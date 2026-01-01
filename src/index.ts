import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './Config/db.config';
import routes from './Routes';
import { errorHandler, notFoundHandler } from './Middleware/error.middleware';

dotenv.config();
const app: Application = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '/api';

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});
app.use(BASE_URL, routes);
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online House Rental & Tenant Management System API',
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
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await testConnection();
    app.listen(PORT, () => {
      console.log('🏠 Online House Rental & Tenant Management System');
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
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Please check your database configuration and ensure MySQL is running.');
    process.exit(1);
  }
};
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason: any) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});
startServer();
