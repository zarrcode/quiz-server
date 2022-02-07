import { type UserSocket } from '../interfaces';

export default function sessionEvent(socket: UserSocket) {
  socket.emit('session', socket.sessionID);
}
