import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { generateQuiz as createGame } from '../../models/quizzes';
import { addGameIDToSession, destroySession } from '../../models/users';
import usersEvent from '../events/usersEvent';
import gameCreatedEvent from '../events/gameCreatedEvent';
import disconnectCustomEvent from '../events/disconnectCustomEvent';

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
      usersEvent(io, socket, gameID);

      // send game ID
      gameCreatedEvent(socket, gameID);
    } catch (err) {
      console.error(err);

      await destroySession(socket.sessionID!);

      // emit custom 'error' to trigger disconnection on client
      const reason = 'failed to create game';
      disconnectCustomEvent(socket, reason);
    }
  });
}
