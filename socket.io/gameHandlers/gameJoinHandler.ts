import { type Server } from 'socket.io';
import { type UserSocket, type Game } from '../interfaces';
// import { getGame, gameExists } from '../TEMP/gameStoreTEMP';
import { addGameIDToSession, destroySession } from '../../models/users';
import { quizExists as gameExists, getQuiz as getGame } from '../../models/quizzes';
import { getGameRoomByID, getUsersInRoom } from './helperFunctions';

async function gameJoinHandler(io: Server, socket: UserSocket, gameID: string) {
  try {
    if (!gameExists(gameID)) {
      await destroySession(socket.sessionID!);
      // emit custom 'error' to trigger disconnection on client
      const reason = 'game does not exist';
      socket.emit('disconnect_custom', reason);
    } else {
      // join user to game
      await addGameIDToSession(socket.sessionID!, gameID);
      socket.join(gameID);

      // send all users in room
      const room = getGameRoomByID(io, gameID);
      const users = getUsersInRoom(io, room!);
      socket.emit('users', users);

      // send game name
      const game: Game = await <Promise<Game>>getGame(gameID);
      socket.emit('game_joined', game.title);

      // alert other users
      const user = {
        sessionID: socket.sessionID,
        username: socket.username,
      };
      socket.to(gameID).emit('users_join', user);
    }
  } catch (err) {
    console.error(err);

    await destroySession(socket.sessionID!);
    // emit custom 'error' to trigger disconnection on client
    const reason = 'failed to join game';
    socket.emit('disconnect_custom', reason);
  }
}

export default gameJoinHandler;
