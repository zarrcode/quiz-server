import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { isGameOver } from '../../models/scoreboard';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function finalScoreboardHandler(io: Server, socket: UserSocket) {
  socket.on('final_scoreboard', async (gameID) => {
    try {
      const room = getGameRoomByID(io, gameID);
      const isOver = await isGameOver(gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('final_scoreboard', isOver));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to retrieve final scoreboard';
      socket.emit('final_scoreboard_error', reason);
    }
  });
}
