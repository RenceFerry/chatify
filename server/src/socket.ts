import 'dotenv/config';
import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;

const initializeSocket = (io: Server) => {
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');

    const token = cookies.token;
    if (!token) return next(new Error("Authentication failed"));

    try {
      const user = jwt.verify(token, jwtSecret);

      socket.data.user = user;
      next();
    } catch (e) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connects ' + socket.id);
  });
};

export default initializeSocket;