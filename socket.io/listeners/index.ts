import { type Server } from 'socket.io';
import { connectionHandler } from '../connectionHandler';

export default function initListeners(io: Server) {
  io.on('connection', (socket) => connectionHandler);
}
