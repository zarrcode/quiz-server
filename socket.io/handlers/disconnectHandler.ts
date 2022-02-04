import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';

export default function disconnectHandler(io: Server, socket: UserSocket) {
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    // update other users in room
    const { sessionID } = socket;
    socket.broadcast.emit('users_leave', sessionID);
  });
}
