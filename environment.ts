import dotenv from 'dotenv';

dotenv.config();

const serverPort = process.env.SERVER_PORT || 3005;

export default serverPort;
