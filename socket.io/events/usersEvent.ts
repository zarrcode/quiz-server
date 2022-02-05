import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getUsersInGame } from '../helperFunctions';

export default function usersEvent(io: Server, socket: UserSocket, gameID: string) {
  const users = getUsersInGame(io, gameID);
  socket.emit('users', users);
}
