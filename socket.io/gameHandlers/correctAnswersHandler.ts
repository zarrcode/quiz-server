import { type UserSocket } from '../interfaces';
import { renderScoreboard, isGameOver } from '../../models/scoreboard';

export default async function correctAnswersHandler(
  socket: UserSocket,
  gameID: string,
) {
  try {
    const scoreboard = await renderScoreboard(gameID);
    const isOver = await isGameOver(gameID);
    socket.emit('scoreboard', scoreboard, isOver);
  } catch (err) {
    console.error(err);
    // emit custom 'error'
    const reason = 'failed to submit answer';
    socket.emit('answer_error', reason);
  }
}
