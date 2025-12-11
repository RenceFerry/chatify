import { Router, Request, Response, NextFunction } from 'express';
import { login, logout, signup, verify, store, authenticate } from '../controllers/auth.controller.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = Router();
const jwtSecret = process.env.JWT_SECRET;
const isproduction = process.env.PRODUCTION === "true";

const createJwt = (req: Request, res: Response) => {
  const token = jwt.sign(req.user as object, jwtSecret as string, { expiresIn: '7d' });

  res.cookie('token', token, { httpOnly: true, secure: isproduction, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  res.redirect('/');
}

router.post('/verify', verify, store, createJwt);
router.post('/login', login, createJwt);
router.post('/authenticate', authenticate, (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({authenticated: true});
});
router.post('/signup', signup);
router.post('/logout', logout);

export default router;