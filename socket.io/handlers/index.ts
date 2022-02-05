import { type Server } from 'socket.io';
import anyHandler from './anyHandler';
import connectionHandler from './connectionHandler';
import gameCreateHandler from './gameCreateHandler';
import gameJoinHandler from './gameJoinHandler';
import getQuestionHandler from './getQuestionHandler';
import submitAnswerHandler from './submitAnswerHandler';
import correctAnswersHandler from './correctAnswersHandler';
import disconnectHandler from './disconnectHandler';

export default function initListeners(io: Server) {
  io.on('connection', (socket) => {
    anyHandler(socket);
    connectionHandler(io, socket);
    gameCreateHandler(io, socket);
    gameJoinHandler(io, socket);
    getQuestionHandler(socket);
    submitAnswerHandler(socket);
    correctAnswersHandler(socket);
    disconnectHandler(socket);
  });
}
