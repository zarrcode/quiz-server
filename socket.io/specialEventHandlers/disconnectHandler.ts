import { type UserSocket } from '../interfaces';

export function disconnectHandler(socket: UserSocket) {
  console.log(`${socket.username} disconnected`);

  // update other users in room
  const { sessionID } = socket;
  socket.broadcast.emit('users_leave', sessionID);
}

export default { disconnectHandler };
