import { createClient } from 'redis';
import 'dotenv/config';

const redis = createClient({
  username: process.env.REDIS_USER!,
  password: process.env.REDIS_PASS!,
  socket: {
    host: process.env.REDIS_URL!,
    port: 15547,
  }
});

redis.on('error', err => console.log('Redis client Error', err));


await redis.connect();

export default redis;