import { Server } from 'socket.io';
import { type UserSocket, type GameCreatePayload } from './interfaces';
import { destroySession, addGameIDToSession } from './TEMP/sessionStoreTEMP';
import { createGame, gameExists } from './TEMP/stubsTEMP';
import { getGameRoomByID, getUsersInRoom } from './helper';

export function addSocketListeners(io: Server, socket: UserSocket) {
  // for developement purposes
  socket.onAny((event, ...args) => console.log(event, ...args));

  socket.on('game_create', async (options: GameCreatePayload) => {
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
  });

  socket.on('game_join', (gameID: string) => {
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
  });

  socket.on('game_start', () => {
    // TODO: get question from model
    // TODO: send question
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    // TODO: emit to all connected rooms that user disconnected, passing identifier
  });
}

export default { addSocketListeners };
