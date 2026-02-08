import { NextFunction, Router, Request, Response } from 'express';
import { authenticate } from '../controllers/auth.controller.js';
import { createConvo, createGroup, resendOtp, editProfile, updateProfile, updateImage } from '../controllers/server.controller.js';
import { verify } from '../controllers/auth.controller.js';
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('File must be an image'));
    } else {
      cb(null, true);
    }
  }
});
const router = Router();

router.post('/createConvo', authenticate, createConvo);
router.post('/createGroup', authenticate, createGroup);
router.post('/editProfile', authenticate, editProfile);
router.post('/resendOtp', authenticate, resendOtp);
router.post('/updateImage', authenticate, (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, updateImage);
router.post('/verify', authenticate, verify, updateProfile);

export default router;