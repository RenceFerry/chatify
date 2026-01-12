import express, { Request, Response, Application } from 'express';
import http from 'http'
import { Server } from 'socket.io';
import { User } from './models/export.js'
import { authenticate } from './controllers/auth.controller.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  authRoutes,
  authPage,
  apiRoutes
} from './routes/export.js'
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import initializeSocket from './socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientUrl = process.env.CLIENT_URL;
const isDevelopment = process.env.NODE_ENV === "development";
const routesRegex = /^\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/(home|chat)$/;

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    credentials: isDevelopment,
    methods: ["GET", "POST"],
  }
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: clientUrl,
  credentials: isDevelopment,
}));
app.use(passport.initialize());

//initialize socket
initializeSocket(io);

//oauth authentication
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callbackURL: "http://localhost:4000/api/auth/google/callback",
  passReqToCallback: true
},
async (request: Request, accessToken: string, refreshToken: string, profile: passport.Profile, done: passport.DoneCallback) => {
    const email = profile.emails?.[0]?.value; 
    const username = profile.displayName || profile.name?.givenName || email?.split('@')[0] || 'user';
    const image = profile.photos?.[0]?.value;
    if (!email) return done(null, false);
    
    try {
      console.log(image, username);
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
app.use(routesRegex, authenticate, (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/auth', authPage);

app.use('/api/auth', authRoutes);

app.use('/api', apiRoutes);

app.use(authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  console.log('hello')
  //@ts-ignore
  res.redirect(`/${user?.id}/home`);
})
//app routes }

export { passport, server };

// import { createUsers, users } from './lib/utils.js';

// createUsers(users);