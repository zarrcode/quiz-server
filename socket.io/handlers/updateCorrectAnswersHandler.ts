import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function finalCorrectAnswersHandler(io: Server, socket: UserSocket) {
  socket.on('correct_answers', async (gameID, correctAnswers) => {
    try {
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('toggle_answers', correctAnswers));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to submit correct answer';
      socket.emit('answer_error', reason);
    }
  });
}
