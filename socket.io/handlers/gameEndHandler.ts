import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { destroyQuiz as destroyGame } from '../../models/quizzes';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function gameEndHandler(io: Server, socket: UserSocket) {
  socket.on('game_end', async () => {
    const { gameID } = socket;
    if (gameID) {
      await destroyGame(gameID);
      const room = <Set<string>>getGameRoomByID(io, gameID);
      const sockets = getSocketsInRoom(io, room);
      sockets.forEach((socket) => {
        socket.disconnect();
      });
    }
  });
}
