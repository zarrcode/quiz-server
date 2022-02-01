import { type Server } from 'socket.io';
import { type UserSocket } from '.';
import sessionStore from './sessionStoreTEMP';

function authenticateUser(socket: UserSocket, next: any) {
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

  const { username } = socket;
  if (!username) return next(new Error());

  const newSessionID = sessionStore.createSession(username);
  socket.sessionID = newSessionID;
  socket.username = username;
  return next();
}

export function addMiddleware(io: Server) {
  io.use(authenticateUser);
}

export default addMiddleware;
