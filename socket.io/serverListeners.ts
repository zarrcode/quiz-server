import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import { addSocketListeners } from './socketListeners';

export function addServerListeners(io: Server) {
  io.on('connection', (socket: UserSocket) => {
    console.log(`${socket.username} connected`);

    addSocketListeners(io, socket);

    socket.emit('session', socket.sessionID);

    // TODO: add logic to rejoin users to ongoing games
  });
}

export default { addServerListeners };
