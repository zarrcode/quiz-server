import { type Server } from 'socket.io';
import { GameCreateOptions, type UserSocket } from '../interfaces';
import { createGame } from '../TEMP/stubsTEMP';
import { addGameIDToSession, destroySession } from '../TEMP/sessionStoreTEMP';
import { getGameRoomByID, getUsersInRoom } from '../helper';

async function gameCreateHandler(io: Server, socket: UserSocket, options: GameCreateOptions) {
  try {
    // create game
    const gameID = await createGame(options); // TODO: replace with call to Angus function

    // send game ID
    socket.emit('game_created', gameID);

    // join user to game
    addGameIDToSession(socket.sessionID!, gameID); // TODO: replace with call to Angus function
    socket.join(gameID);

    // send all users in room
    const room = getGameRoomByID(io, gameID);
    const users = getUsersInRoom(io, room!);
    socket.emit('users', users);
  } catch (err) {
    console.error(err);

    destroySession(socket.sessionID!); // TODO: replace with call to Angus function
    // emit custom 'error' to trigger disconnection on client
    const reason = 'failed to create game';
    socket.emit('disconnect_custom', reason);
  }
}

export default gameCreateHandler;
