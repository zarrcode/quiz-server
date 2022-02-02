import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Connection Error', err));
console.log('connection to client')

client.connect();

export default client;