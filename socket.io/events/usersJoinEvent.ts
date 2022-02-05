import { UserSocket } from '../interfaces';

export default function usersJoinEvent(socket: UserSocket, gameID: string) {
  const user = {
    sessionID: socket.sessionID,
    username: socket.username,
  };
  socket.to(gameID).emit('users_join', user);
}
