import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { renderScoreboard, isGameOver, updateScoreboard } from '../../models/scoreboard';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function finalCorrectAnswersHandler(io: Server, socket: UserSocket) {
  socket.on('final_correct_answers', async (gameID, correctAnswers) => {
    try {
      await updateScoreboard(gameID, correctAnswers);
      const scoreboard = await renderScoreboard(gameID);
      const isOver = await isGameOver(gameID);
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('scoreboard', scoreboard, isOver));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to finalise correct answers';
      socket.emit('answer_error', reason);
    }
  });
}
