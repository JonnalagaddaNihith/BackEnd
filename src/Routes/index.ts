import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
