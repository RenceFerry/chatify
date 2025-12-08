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

try {
  redis.on('error', err => console.log('Redis client Error', err));
  
  await redis.connect();
} catch (e){
  console.log(e);
}

export default redis;