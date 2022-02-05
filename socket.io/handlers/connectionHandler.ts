import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import sessionEvent from '../events/sessionEvent';
import usersEvent from '../events/usersEvent';
import gameDataEvent from '../events/gameDataEvent';

export default async function connectionHandler(io: Server, socket: UserSocket) {
  console.log(`${socket.username} connected`);

  sessionEvent(socket);

  const { gameID } = socket;
  if (gameID) {
    // rejoin reconnecting users to ongoing games
    usersEvent(io, socket, gameID);
    socket.join(gameID);
    gameDataEvent(socket, gameID);
  }
}
