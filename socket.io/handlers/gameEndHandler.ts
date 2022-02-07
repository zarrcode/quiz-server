import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { destroyQuiz as destroyGame } from '../../models/quizzes';
import { disconnectSocketsInGame } from '../helperFunctions';

export default function gameEndHandler(io: Server, socket: UserSocket) {
  socket.on('game_end', async () => {
    const { gameID } = socket;
    console.log(gameID);
    if (gameID) {
      console.log('about to destory game');
      await destroyGame(gameID);
      disconnectSocketsInGame(io, gameID);
    }
  });
}
