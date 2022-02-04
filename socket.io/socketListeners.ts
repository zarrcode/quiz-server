import { Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import gameCreateHandler from './gameHandlers/gameCreateHandler';
import gameJoinHandler from './gameHandlers/gameJoinHandler';
import getQuestionHandler from './gameHandlers/getQuestionHandler';
import submitAnswerHandler from './gameHandlers/submitAnswerHandler';
import { disconnectHandler } from './specialEventHandlers/disconnectHandler';
import correctAnswersHandler from './gameHandlers/correctAnswersHandler';

export function addSocketListeners(io: Server, socket: UserSocket) {
  // for developement purposes
  socket.onAny((event, ...args) => console.log(event, ...args));

  socket.on('game_create', (options) => gameCreateHandler(io, socket, options));
  socket.on('game_join', (gameID) => gameJoinHandler(io, socket, gameID));
  socket.on('retrieve_question', (gameID) => getQuestionHandler(socket, gameID));
  socket.on('submit_answer', (gameID, answer, username) => submitAnswerHandler(socket, gameID, answer, username));
  socket.on('correct_answers', (gameID, correctAnswers) => correctAnswersHandler(socket, gameID, correctAnswers));

  // special events
  socket.on('disconnect', () => disconnectHandler(socket));
}

export default { addSocketListeners };
