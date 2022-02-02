/* eslint-disable no-console */
import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import { addSocketListeners } from './socketListeners';
import sessionStore from './sessionStoreTEMP';

export function addServerListeners(io: Server) {
  io.on('connection', (socket: UserSocket) => {
    const { username } = socket;

    console.log(`${socket.username} connected`);

    // create new session
    if (username) {
      const sessionID = sessionStore.createSession(username);
      socket.emit('session', sessionID);
    }

    addSocketListeners(socket);
  });
}

export default { addServerListeners };
