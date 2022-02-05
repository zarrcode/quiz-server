import { type UserSocket } from '../interfaces';
import { getQuiz as getGameData } from '../../models/quizzes';

export default async function gameDataEvent(socket: UserSocket, gameID: string) {
  const gameData = await getGameData(gameID);
  socket.emit('game_data', gameData);
}
