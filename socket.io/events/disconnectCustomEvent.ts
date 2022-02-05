import { type UserSocket } from '../interfaces';

export default function disconnectCustomEvent(socket: UserSocket, reason: string) {
  socket.emit('disconnect_custom', reason);
}
