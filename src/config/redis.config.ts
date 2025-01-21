import { Redis } from 'ioredis';

let client: Redis;
export default function connectRedis() {
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PWD || '';

  if (!client) client = new Redis({ host, port, username: 'default', password });
  return client;
}
