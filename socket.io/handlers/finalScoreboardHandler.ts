import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function finalScoreboardHandler(io: Server, socket: UserSocket) {
  socket.on('final_scoreboard', async (gameID) => {
    try {
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('final_scoreboard'));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to retrieve final scoreboard';
      socket.emit('final_scoreboard_error', reason);
    }
  });
}
