import { type Server } from 'socket.io';
import { type GameCreateOptions, type UserSocket } from '../interfaces';
import { createGame } from '../TEMP/gameStoreTEMP';
import { addGameIDToSession, destroySession } from '../TEMP/sessionStoreTEMP';
import { getGameRoomByID, getUsersInRoom } from './helperFunctions';

async function gameCreateHandler(io: Server, socket: UserSocket, options: GameCreateOptions) {
  try {
    // create game
    const hostID = socket.sessionID;
    // TODO: replace with call to Angus function
    const { gameID } = await createGame(hostID!, options);

    // join user to game
    addGameIDToSession(socket.sessionID!, gameID); // TODO: replace with call to Angus function
    socket.join(gameID);

    // send all users in room
    const room = getGameRoomByID(io, gameID);
    const users = getUsersInRoom(io, room!);
    console.log(users);
    socket.emit('users', users);

    // send game ID
    socket.emit('game_created', gameID);
  } catch (err) {
    console.error(err);

    destroySession(socket.sessionID!); // TODO: replace with call to Angus function
    // emit custom 'error' to trigger disconnection on client
    const reason = 'failed to create game';
    socket.emit('disconnect_custom', reason);
  }
}

export default gameCreateHandler;
