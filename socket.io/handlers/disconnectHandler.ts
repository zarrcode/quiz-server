import { type UserSocket } from '../interfaces';
import usersLeaveEvent from '../events/usersLeaveEvent';

export default function disconnectHandler(socket: UserSocket) {
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    usersLeaveEvent(socket);
  });
}
