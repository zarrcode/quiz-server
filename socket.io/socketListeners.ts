/* eslint-disable no-console */
import { type UserSocket, type GameCreatePayload } from './interfaces';
import { destroySession } from './sessionStoreTEMP';
import { createGame, checkGameExists } from './stubsTEMP';

export function addSocketListeners(socket: UserSocket) {
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    // TODO: emit to all connected rooms that user disconnected, passing identifier
  });

  socket.on('game_create', async (options: GameCreatePayload) => {
    try {
      const gameID = await createGame(options); // TODO: replace with call to Angus function
      socket.join(gameID);
      socket.emit('game_created', gameID);
    } catch {
      destroySession(socket.sessionID!); // TODO: replace with call to Angus function
      // emit custom 'error' to trigger disconnection on client
      const reason = 'game creation failed';
      socket.emit('disconnect_custom', reason);
    }
  });

  socket.on('game_join', (gameID: string) => {
    try {
      if (checkGameExists(gameID)) {
        socket.join(gameID);
      }
      const user = { username: socket.username };
      socket.emit('game_joined', user);
      socket.broadcast.emit('game_joined_other_user', user);
    } catch {
      // emit custom 'error' to trigger disconnection on client
      const reason = 'game does not exist';
      socket.emit('disconnect_custom', reason);
    }
  });

  socket.on('game_start', () => {
    // TODO: get question from model
    // TODO: send question
  });
}

export default { addSocketListeners };
