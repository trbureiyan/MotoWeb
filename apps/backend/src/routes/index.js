// Monta todos los routers bajo /api
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import appointmentsRoutes from './appointments.routes.js';
import brandsRoutes from './brands.routes.js';
import servicesRoutes from './services.routes.js';
import usersRoutes from './users.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/brands', brandsRoutes);
router.use('/services', servicesRoutes);
router.use('/users', usersRoutes);

export default router;
