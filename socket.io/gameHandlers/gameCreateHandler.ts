import { type Server } from 'socket.io';
import { type Game, type UserSocket } from '../interfaces';
import { getGameRoomByID, getUsersInRoom } from './helperFunctions';
import { generateQuiz as createGame } from '../../models/quizzes';
import { addGameIDToSession, destroySession } from '../../models/users';

async function gameCreateHandler(io: Server, socket: UserSocket, options: Game) {
  try {
    // create game
    const hostID = socket.sessionID;
    const gameID = await <Promise<string>>createGame(options, hostID!);

    // join user to game
    await addGameIDToSession(socket.sessionID!, gameID);
    socket.join(gameID);

    // send all users in room
    const room = getGameRoomByID(io, gameID);
    const users = getUsersInRoom(io, room!);
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
}

export default gameCreateHandler;
