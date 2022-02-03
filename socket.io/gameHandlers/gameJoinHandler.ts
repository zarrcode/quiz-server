import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { gameExists } from '../TEMP/stubsTEMP';
import { addGameIDToSession, destroySession } from '../TEMP/sessionStoreTEMP';
import { getGameRoomByID, getUsersInRoom } from './helperFunctions';

function gameJoinHandler(io: Server, socket: UserSocket, gameID: string) {
  try {
    if (!gameExists(gameID)) {
      destroySession(socket.sessionID!); // TODO: replace with call to Angus function
      // emit custom 'error' to trigger disconnection on client
      const reason = 'game does not exist';
      socket.emit('disconnect_custom', reason);
    }

    // join user to game
    addGameIDToSession(socket.sessionID!, gameID); // TODO: replace with call to Angus function
    socket.join(gameID);

    // send all users in room
    const room = getGameRoomByID(io, gameID);
    const users = getUsersInRoom(io, room!);
    socket.emit('users', users);

    // alert other users
    const user = { username: socket.username };
    socket.to(gameID).emit('users_join', user);
  } catch (err) {
    console.error(err);

    destroySession(socket.sessionID!); // TODO: replace with call to Angus function
    // emit custom 'error' to trigger disconnection on client
    const reason = 'failed to join game';
    socket.emit('disconnect_custom', reason);
  }
}

export default gameJoinHandler;
