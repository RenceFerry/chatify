import { Router } from 'express';
import { getId } from '../controllers/api.controller.js'
import { authenticate } from '../controllers/auth.controller.js';

const router = Router();

router.get('/getId', authenticate, getId);

export default router;