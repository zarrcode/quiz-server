/* eslint-disable no-console */
import { type Server } from 'socket.io';
import { type UserSocket } from '.';

export function addListeners(io: Server) {
  io.on('connection', (socket: UserSocket) => {
    console.log(`${socket.username} connected`);
  });
}

export default addListeners;
