import express, { Request, Response, Application } from 'express';
import http from 'http'
import { Server } from 'socket.io';
import { User } from './models/export.js'
import { authenticate } from './controllers/auth.controller.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
  authRoutes,
  apiRoutes,
  serverActionRoutes
} from './routes/export.js'
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import initializeSocket from './socket.js';
import { CLIENT_BASE_URL } from './lib/utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV === "development";
const routesRegex = /^\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/(home|chat)$/;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback";
const jwtSecret = process.env.JWT_SECRET;

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_BASE_URL,
    credentials: isDevelopment,
    methods: ["GET", "POST"],
  }
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_BASE_URL,
  credentials: isDevelopment,
}));
app.use(passport.initialize());

//initialize socket
initializeSocket(io);

//oauth authentication
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callbackURL: googleCallbackUrl,
  passReqToCallback: true
},
async (request: Request, accessToken: string, refreshToken: string, profile: passport.Profile, done: passport.DoneCallback) => {
    const email = profile.emails?.[0]?.value; 
    const username = profile.displayName || profile.name?.givenName || email?.split('@')[0] || 'user';
    const image = profile.photos?.[0]?.value;
    if (!email) return done(null, false);
    
    try {
      const user = await User.findOrCreate({
        email: email,
        username: username as string,
        image: image as string,
      });

      done(null, user);
    } catch (e) {
      done(e, false);
    }
  }
))

//app routes {
app.use(express.static(path.join(__dirname, '../../frontend/dist'), {
  index: false,
}));

app.use('/api/auth', authRoutes);

app.use('/api/serverActions', serverActionRoutes);

app.use('/api', apiRoutes);

app.use(routesRegex, (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = jwt.verify(token as string, jwtSecret as string);
    
    req.user = user as Object;
  } catch (e) {
    return res.redirect('/auth/login');
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.all(/^\/.*/, (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
})
//app routes }

export { passport, server };

// import transporter from './lib/nodemailer.js';

// transporter.sendMail({
//     from: process.env.NODEMAILER_EMAIL,
//     to: 'ferryfajaritoclarence@gmail.com',
//     subject: "Verify your email",
//     text: `${'otp'}`
//   });

// import { createUsers, users } from './lib/utils.js';
// createUsers(users);