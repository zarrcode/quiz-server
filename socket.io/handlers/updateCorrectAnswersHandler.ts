import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function updateCorrectAnswersHandler(io: Server, socket: UserSocket) {
  socket.on('correct_answers', async (gameID, users) => {
    try {
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('toggle_answers', users));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to update correct answers';
      socket.emit('toggle_answers_error', reason);
    }
  });
}
