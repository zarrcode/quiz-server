import dotenv from 'dotenv';

dotenv.config();

const serverPort = process.env.SERVER_PORT || 3005;
export const clientURL = process.env.CLIENT_URL || 'https://next-quiz.herokuapp.com/';

export default serverPort;
