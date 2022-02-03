import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import gameCreateHandler from './gameHandlers/gameCreateHandler';
import gameJoinHandler from './gameHandlers/gameJoinHandler';

export function addSocketListeners(io: Server, socket: UserSocket) {
  // for developement purposes
  socket.onAny((event, ...args) => console.log(event, ...args));

  socket.on('game_create', (options) => gameCreateHandler(io, socket, options));
  socket.on('game_join', (gameID) => gameJoinHandler(io, socket, gameID));

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
