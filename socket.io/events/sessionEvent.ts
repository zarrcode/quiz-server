import { type UserSocket } from '../interfaces';

export default function sessionEvent(socket: UserSocket) {
  const { sessionID } = socket;
  socket.emit('session', sessionID);
}
