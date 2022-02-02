/* eslint-disable no-console */
import { type UserSocket } from './interfaces';

export function addSocketListeners(socket: UserSocket) {
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);

    // TODO: emit to all connected rooms that user disconnected, passing identifier
  });

  socket.on('game_create', (payload: any) => { // TODO: type payload
    // call Angus function to create game, and receive game ID
    // user joins room using game ID
    // emit game_joined with game ID and username
  });

  socket.on('game_join', (payload: any) => { // TODO: type payload
    // call Angus function to confirm game exists
    // user joins room using game ID
    // broadcast game_joined event with username and user ID
  });

  socket.on('game_start', () => {
    
  });
}

export default { addSocketListeners };
