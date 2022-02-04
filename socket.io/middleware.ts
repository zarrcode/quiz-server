/* eslint-disable no-param-reassign */
import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import { findSession, createSession } from '../models/users';

async function authenticateUser(socket: UserSocket, next: any) {
  // handle reconnecting users
  const { sessionID } = socket.handshake.auth;
  if (sessionID) { // game ongoing
    const session = await findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.username = session.username;
      socket.gameID = session.gameID;
      return next();
    }
  }

  // handle manual connection
  const hasUsername = Object.prototype.hasOwnProperty.call(socket.handshake.auth, 'username');
  if (hasUsername) {
    // create new session
    const { username } = socket.handshake.auth; // username only passed on first connection
    if (username) {
      const sessionID = await <Promise<string>>createSession(username);

      socket.sessionID = sessionID;
      socket.username = username;
      return next();
    }

    return next(new Error('username invalid'));
  }

  // refuse users with deleted sessions
  return next(new Error('session deleted'));
}

export function addMiddleware(io: Server) {
  io.use(authenticateUser);
}

export default { addMiddleware };
