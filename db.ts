import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Connection Error', err));

client.connect();

export default client;