import { Router, Request, Response, NextFunction } from 'express';
import { login, logout, signup, verify, store, authenticate, resendOtp } from '../controllers/auth.controller.js'
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { passport } from '../app.js';

const router = Router();
const jwtSecret = process.env.JWT_SECRET;
const isproduction = process.env.PRODUCTION === "true";

const createJwt = (req: Request, res: Response) => {
  const token = jwt.sign(req.user as object, jwtSecret as string, { expiresIn: '7d' });

  res.cookie('token', token, { httpOnly: true, secure: isproduction, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  //@ts-ignore
  res.redirect(`/${req.user?.id}/home`);
}

router.post('/verify', verify, store, createJwt);
router.post('/login', login, createJwt);
router.post('/authenticate', authenticate, (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({authenticated: true});
});
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/resendOtp', resendOtp);
router.post('/google', 
  passport.authenticate('google', { scope: [ 'email', 'profile' ]})
);
router.use('/google/callback', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate( 'google', (err: Error | null, user: {
    email: string,
    username: string | null,
    id: string,
  } | false, info?: {message?: string} ) => {

    if (err) return res.status(500).json({message: "server error"});
    
    if (!user) return res.redirect('/auth/login');

    req.user = user;
    next();

  })(req, res, next)
}, createJwt);

export default router;