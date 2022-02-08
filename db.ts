import { createClient } from 'redis';

const client = createClient({
  url: 'redis://:p2049463d4cc86eb13dab1abd7eda7d91f9991bd2dc1d572853ad4e7861718519@ec2-34-251-79-166.eu-west-1.compute.amazonaws.com:30780',
});

client.connect();

client.on('error', (err) => console.log('Redis Connection Error', err));
console.log('connection to client');

export default client;
