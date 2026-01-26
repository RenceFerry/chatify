import { Router } from 'express';
import { authenticate } from '../controllers/auth.controller.js';
import { createConvo, createGroup, resendOtp, editProfile, updateProfile } from '../controllers/server.controller.js';
import { verify } from '../controllers/auth.controller.js';

const router = Router();

router.post('/createConvo', authenticate, createConvo);
router.post('/createGroup', authenticate, createGroup);
router.post('/editProfile', authenticate, editProfile);
router.post('/resendOtp', authenticate, resendOtp);
router.post('/verify', authenticate, verify, updateProfile);

export default router;