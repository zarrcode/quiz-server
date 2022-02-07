import { type Server } from 'socket.io';
import anyHandler from './anyHandler';
import connectionHandler from './connectionHandler';
import gameCreateHandler from './gameCreateHandler';
import gameJoinHandler from './gameJoinHandler';
import getQuestionHandler from './getQuestionHandler';
import submitAnswerHandler from './submitAnswerHandler';
import correctAnswersHandler from './finalCorrectAnswersHandler';
import updateCorrectAnswersHandler from './updateCorrectAnswersHandler';
import gameEndHandler from './gameEndHandler';
import disconnectHandler from './disconnectHandler';
import finalScoreboardHandler from './finalScoreboardHandler';

export default function initListeners(io: Server) {
  io.on('connection', (socket) => {
    anyHandler(socket);
    connectionHandler(io, socket);
    gameCreateHandler(io, socket);
    gameJoinHandler(io, socket);
    getQuestionHandler(io, socket);
    submitAnswerHandler(io, socket);
    updateCorrectAnswersHandler(io, socket);
    correctAnswersHandler(io, socket);
    finalScoreboardHandler(io, socket);
    gameEndHandler(io, socket);
    disconnectHandler(socket);
  });
}
