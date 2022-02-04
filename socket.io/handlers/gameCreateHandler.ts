import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getUsersInGame } from '../helperFunctions';
import { generateQuiz as createGame } from '../../models/quizzes';
import { addGameIDToSession, destroySession } from '../../models/users';

export default function gameCreateHandler(io: Server, socket: UserSocket) {
  socket.on('game_create', async (options) => {
    try {
      // create game
      const hostID = socket.sessionID;
      const gameID = await <Promise<string>>createGame(options, hostID!);

      // join user to game
      await addGameIDToSession(socket.sessionID!, gameID);
      socket.join(gameID);

      // send all users in room
      const users = getUsersInGame(io, gameID);
      socket.emit('users', users);

      // send game ID
      socket.emit('game_created', gameID);
    } catch (err) {
      console.error(err);

      await destroySession(socket.sessionID!);
      // emit custom 'error' to trigger disconnection on client
      const reason = 'failed to create game';
      socket.emit('disconnect_custom', reason);
    }
  });
}
