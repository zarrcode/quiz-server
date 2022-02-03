/* eslint-disable no-param-reassign */
import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import sessionStore from './TEMP/sessionStoreTEMP';

function authenticateUser(socket: UserSocket, next: any) {
  // handle reconnecting users
  const { sessionID } = socket.handshake.auth;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.username = session.username;
      socket.gameID = session.gameID;
      return next();
    }
  }

  // handle first time connection
  const { username } = socket.handshake.auth; // username only passed on first connection
  if (username) {
    // create new session
    const sessionID = sessionStore.createSession(username);
    socket.sessionID = sessionID;
    socket.username = username;
    return next();
  }

  // refuse users with falsy usernames and users attempting to reconnect to closed lobbies
  return next(new Error());
}

export function addMiddleware(io: Server) {
  io.use(authenticateUser);
}

export default { addMiddleware };
