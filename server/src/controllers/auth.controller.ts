import { Response, Request, NextFunction } from 'express';
import { User } from '../models/export.js'
import redis from '../lib/redis.js';
import transporter from '../lib/nodemailer.js';
import { generateSecureNumber } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import { signupSchema, loginSchema } from '../lib/schema.js';
import jwt from 'jsonwebtoken';
import z from 'zod';
import 'dotenv/config'

const isProduction = process.env.PRODUCTION == 'true';
const sameSite = process.env.SAME_SITE || 'lax';
const jwtSecret = process.env.JWT_SECRET;

type User = {
  email: string,
  username: string,
  password: string,
} | Object;

//login controller
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const validatedData = loginSchema.safeParse(data);

  //validation check
  if (!validatedData.success) {
    return res.status(400).json({
      error: z.treeifyError(validatedData.error),
      message: "Login failed"
    });
  }

  //compare password
  try {
    const user = await User.findByEmail(validatedData.data.email);

    //check if acccount exist
    if (!user) {
      return res.status(400).json({
        message: "Account don't exist"
      })
    }

    const { password, email, username, id } = user;
    if (!password) return res.status(400).json({
      message: "User don't have a password, login with the following options instead."
    })

    const isCorrect = await bcrypt.compare(validatedData.data.password as string, user.password as string);

    if (isCorrect) {
      req.user = { id, email, username };
      next();
    } else {
      return res.status(400).json({
        message: "Incorrect email or password"
      })
    }
  } catch (e) {
    return res.status(500).json({
      message: "Server error, try again later"
    })
  }
}

//signup controller
export const signup = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) return res.status(400).json({
    message: 'Missing fields'
  })
  console.log(data);
  const validatedData = signupSchema.safeParse(data);

  //validation check
  if (!validatedData.success) {
    return res.status(400).json({
      error: z.treeifyError(validatedData.error),
      message: "Signup failed"
    });
  }

  //check if user already exists
  try {
    const existing = await User.findByEmail(validatedData.data.email)

    if (existing) {
      return res.status(400).json({
        message: "Email already in use"
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error, try again later"
    })
  }

  //for verifying
  const otp = generateSecureNumber(6);
  const { username, email } = validatedData.data;
  const password = await bcrypt.hash(validatedData.data.password, 10);

  try {
    const res = await redis.set(email, JSON.stringify({username, password, email, otp}), {expiration: {type: 'EX', value: 60*60}});

    console.log(res);
    console.log(`Storing email${email}!`);
  } catch (e) {
    return res.status(500).json({
      message: "Server error, try again later"
    })
  }

  res.cookie("email", email, {
    path: '/',
    httpOnly: true,
    //@ts-ignore
    sameSite: 'none',
    secure: true
  })
  sendEmail(email, otp);
  return res.redirect('/auth/verify');
}

//verify controller
export const verify = async (req: Request, res: Response, next: NextFunction) =>{
  const email = req.cookies.email;
  const otp = Number(req.body.otp);
  
  console.log(otp, email)
  let data;
  try {
    const result = await redis.get(email);

    if (!result) {
      return res.status(400).json({
        message: "Invalid OTP"
      })
    }

    data = JSON.parse(result!);
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: "Server error, try again later"
    })
  }

  if (data.otp === otp) {
    const { email, username, password } = data;
    req.user = { email, username, password };

    next();
  }
  else return res.status(400).json({
    message: "Invalid OTP"
  })
}

//logout controller
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('email');

  res.redirect('/login');
}

//authentication controller
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({authenticated: false});
  }

  try {
    const user = jwt.verify(token as string, jwtSecret as string);

    next();
  } catch (e) {
    return res.status(401).json({authenticated: false});
  }
}

//store user in db
export const store = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    //@ts-ignore
    const { email, password, username }= req.user;

    try {
      const user = await User.create({
        data: {
          email,
          username,
          password
        },
        select: {
          id: true,
          email: true,
          username: true,
        }
      })

      req.user = user;
    } catch(e) {
      return res.status(500).json({
        message: "Server error, try again later"
      })
    }
    
    return next();
  }
}

//some helper functions
const sendEmail = (email: string, otp: number) => {
  transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Verify your email",
    text: `${otp}`
  });
  console.log('email sent');
}