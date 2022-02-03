import { Server } from 'socket.io';
import { getGameRoomByID, getUsersInRoom } from './gameHandlers/helperFunctions';
import { type UserSocket } from './interfaces';
import { addSocketListeners } from './socketListeners';
import { getGame } from './TEMP/gameStoreTEMP';

export function addServerListeners(io: Server) {
  io.on('connection', (socket: UserSocket) => {
    console.log(`${socket.username} connected`);

    addSocketListeners(io, socket);

    socket.emit('session', socket.sessionID);

    const { gameID } = socket;
    if (gameID) {
      // send all users in room
      const room = getGameRoomByID(io, gameID);
      const users = getUsersInRoom(io, room!);
      socket.emit('users', users);

      // send game data
      socket.join(gameID);
      const game = getGame(gameID);
      socket.emit('game_rejoined', game);
    }
  });
}

export default { addServerListeners };
