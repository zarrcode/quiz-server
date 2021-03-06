import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import {
  renderScoreboard, updateScoreboard, updateScoreState, isGameOver,
} from '../../models/scoreboard';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function finalCorrectAnswersHandler(io: Server, socket: UserSocket) {
  socket.on('final_correct_answers', async (gameID, correctAnswers) => {
    try {
      await updateScoreboard(gameID, correctAnswers);
      await updateScoreState(gameID);
      const gameOver = await isGameOver(gameID);
      const scoreboard = await renderScoreboard(gameID);
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        if (gameOver) sockets.forEach((socket) => socket.emit('final_scoreboard', scoreboard));
        else sockets.forEach((socket) => socket.emit('scoreboard', scoreboard));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to finalise correct answers';
      socket.emit('scoreboard_error', reason);
    }
  });
}
