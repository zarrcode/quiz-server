import { type Server } from 'socket.io';
import authenticateUser from './authenticateUser';

export default function initMiddleware(io: Server) {
  io.use(authenticateUser);
}
