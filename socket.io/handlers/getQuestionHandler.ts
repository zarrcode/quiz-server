import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getCurrentQuestion } from '../../models/quizzes';
import { haveAllAnswered } from '../../models/answers';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function getQuestionHandler(io: Server, socket: UserSocket) {
  socket.on('retrieve_question', async (gameID) => {
    try {
      const questionAndAnswers = await getCurrentQuestion(gameID);
      const isAllAnswered = await haveAllAnswered(gameID);
      console.log(isAllAnswered);
      let seconds = 10;
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => {
          socket.emit('new_question', questionAndAnswers);
        });
        if (seconds) {
          const timer = setInterval(async () => {
            seconds -= 1;
            sockets.forEach((socket) => {
              socket.emit('timer', seconds);
            });
            if (seconds < 1 || isAllAnswered) {
              clearInterval(timer);
              sockets.forEach((socket) => socket.emit('timeout'));
            }
          }, 1000);
        }
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to retrieve question';
      socket.emit('question_error', reason);
    }
  });
}
