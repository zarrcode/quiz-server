/* eslint-disable no-param-reassign */
import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import sessionStore from './sessionStoreTEMP';

function authenticateUser(socket: UserSocket, next: any) {
  // handle reconnecting users
  const { sessionID } = socket.handshake.auth;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.username = session.username;
      socket.lobbyID = session.lobbyID;
      return next();
    }
  }

  // if no session, user is either connecting for first time, or lobby has been closed
  const { username } = socket.handshake.auth; // username only passed on first connection

  // refuse users attempting to reconnect to closed lobbies
  if (!username) return next(new Error('lobby closed'));

  // handle first time connection
  socket.username = username;
  return next();
}

export function addMiddleware(io: Server) {
  io.use(authenticateUser);
}

export default { addMiddleware };
