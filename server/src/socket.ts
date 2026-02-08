
import 'dotenv/config';
import { Server, Socket } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import redis from './lib/redis.js';
import { conversationEvents, messageEvents } from './sockets/events.js';

const jwtSecret = process.env.JWT_SECRET!;

const initializeSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
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

  io.on('connection', async (socket: Socket) => {
    const user = socket.data.user;
    socket.join(user.id);
    const key = `presence:user:${user.id}`

    // for automatic active inactive status
    await redis.set(key, JSON.stringify({online: true}), { expiration: { type: 'EX', value: 300 } })

    const interval = setInterval(async ()=>{
      await redis.set(key, JSON.stringify({ online: true}), { expiration: { type: 'EX', value: 300}});
    })
    //

    //conversation events
    conversationEvents(socket, io);

    //message events
    messageEvents(socket, io);

    socket.on('disconnect', () => {
      clearInterval(interval);
      redis.del(key);
    })
  });
};

export default initializeSocket;