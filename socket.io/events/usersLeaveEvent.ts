import { type UserSocket } from '../interfaces';
// import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function usersLeaveEvent(socket: UserSocket) {
  const { sessionID } = socket;
  // const { gameID } = socket;
  // const room = getGameRoomByID(gameID);
  // const sockets = getSocketsInRoom()
  socket.broadcast.emit('users_leave', sessionID); // TODO: just braodcast to room
}
