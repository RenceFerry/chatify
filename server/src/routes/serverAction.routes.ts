import { Router } from 'express';
import { authenticate } from '../controllers/auth.controller.js';
import { createConvo } from '../controllers/server.controller.js';

const router = Router();

router.post('/createConvo', authenticate, createConvo);

export default router;