import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import gameCreateHandler from './gameHandlers/gameCreateHandler';
import gameJoinHandler from './gameHandlers/gameJoinHandler';
import getQuestionHandler from './gameHandlers/getQuestionHandler';
import submitAnswerHandler from './gameHandlers/submitAnswerHandler';

export function addSocketListeners(io: Server, socket: UserSocket) {
  // for developement purposes
  socket.onAny((event, ...args) => console.log(event, ...args));

  socket.on('game_create', (options) => gameCreateHandler(io, socket, options));
  socket.on('game_join', (gameID) => gameJoinHandler(io, socket, gameID));
  socket.on('retrieve_question', (gameID) => getQuestionHandler(socket, gameID)); // TODO: write handler
  socket.on('submit_answer', (gameID, answer, username) => submitAnswerHandler(socket, gameID, answer, username));

  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);
    // TODO: emit to all connected rooms that user disconnected, passing identifier
  });
}

export default { addSocketListeners };
