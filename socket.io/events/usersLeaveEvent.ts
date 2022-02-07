import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';
// import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function usersLeaveEvent(io: Server, socket: UserSocket) {
  const { sessionID } = socket;
  const { gameID } = socket;
  const room = <Set<string>>getGameRoomByID(io, gameID!);
  const sockets = getSocketsInRoom(io, room);

  sockets.forEach((socket) => {
    socket.emit('users_leave', sessionID);
  });
}
