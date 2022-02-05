import { UserSocket } from '../interfaces';

export default function usersLeaveEvent(socket: UserSocket) {
  const { sessionID } = socket;
  socket.broadcast.emit('users_leave', sessionID);
}
