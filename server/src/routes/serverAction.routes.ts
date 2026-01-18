import { Router } from 'express';
import { authenticate } from '../controllers/auth.controller.js';
import { createConvo, createGroup } from '../controllers/server.controller.js';

const router = Router();

router.post('/createConvo', authenticate, createConvo);
router.post('/createGroup', authenticate, createGroup);

export default router;