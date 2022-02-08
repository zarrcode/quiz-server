import { type Server } from 'socket.io';
import { type UserSocket, type GameMetadata } from '../interfaces';
import { setGameTimeout } from '../helperFunctions';
import { addGameIDToSession, destroySession } from '../../models/users';
import { quizExists as checkGameExists, getQuiz as getGame } from '../../models/quizzes';
import disconnectCustomEvent from '../events/disconnectCustomEvent';
import usersEvent from '../events/usersEvent';
import gameJoinedEvent from '../events/gameJoinedEvent';
import usersJoinEvent from '../events/usersJoinEvent';

export default function gameJoinHandler(io: Server, socket: UserSocket) {
  socket.on('game_join', async (gameID) => {
    try {
      // set timeout
      setGameTimeout(io, gameID);

      const gameExists = await checkGameExists(gameID);

      if (!gameExists) {
        await destroySession(socket.sessionID!);
        // emit custom 'error' to trigger disconnection on client
        const reason = 'game does not exist';
        disconnectCustomEvent(socket, reason);
      } else {
        // join user to game
        await addGameIDToSession(socket.sessionID!, gameID);
        socket.gameID = gameID;
        socket.join(gameID);

        // send all users in room
        usersEvent(io, socket, gameID);

        // send game name
        const game = await <Promise<GameMetadata>>getGame(gameID);
        gameJoinedEvent(socket, game.Title);

        // alert other users
        usersJoinEvent(socket, gameID);
      }
    } catch (err) {
      console.error(err);

      await destroySession(socket.sessionID!);

      // emit custom 'error' to trigger disconnection on client
      const reason = 'failed to join game';
      disconnectCustomEvent(socket, reason);
    }
  });
}
