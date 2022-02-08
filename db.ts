import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();

client.on('error', (err) => console.log('Redis Connection Error', err));
console.log('connection to client');

export default client;
