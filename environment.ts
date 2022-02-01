import dotenv from 'dotenv';

dotenv.config();

const serverPort = process.env.SERVER_PORT || 3005;
export const clientURL = process.env.CLIENT_URL || 'http://localhost:3001';

export default serverPort;
