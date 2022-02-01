import { type Server, type Socket } from 'socket.io';
import addListeners from './listeners';
import addMiddleware from './middleware';

export default function configureSocketServer(io: Server) {
  addMiddleware(io);
  addListeners(io);
}

export interface UserSocket extends Socket {
  sessionID?: string,
  username?: string,
  lobbyID?: string,
}
