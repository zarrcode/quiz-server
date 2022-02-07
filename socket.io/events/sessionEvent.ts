import { type UserSocket } from '../interfaces';

export default function sessionEvent(socket: UserSocket) {
  const session = {
    sessionID: socket.sessionID,
    username: socket.username,
    gameID: socket.gameID,
  };
  socket.emit('session', session);
}
