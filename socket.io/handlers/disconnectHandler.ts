import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import usersLeaveEvent from '../events/usersLeaveEvent';

export default function disconnectHandler(io: Server, socket: UserSocket) {
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    usersLeaveEvent(io, socket);
  });
}
