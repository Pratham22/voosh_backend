import express from 'express';
import webUserRoutes from './web/user.routes.js';

const router = express.Router();

router.use('/v0', webUserRoutes);

export default router;