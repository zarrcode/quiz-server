import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getCurrentQuestion } from '../../models/quizzes';
import { getAnswersAndBoolean } from '../../models/answers';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function getQuestionHandler(io: Server, socket: UserSocket) {
  socket.on('retrieve_question', async (gameID) => {
    try {
      const questionAndAnswers = await getCurrentQuestion(gameID);
      let seconds = 30; // await ANGUSTIMERGET
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => {
          socket.emit('new_question', questionAndAnswers);
          if (seconds) {
            const timer = setInterval(async () => {
              seconds -= 1;
              socket.emit('timer', seconds);
              if (seconds < 1) {
                clearInterval(timer);
                const answerList = await getAnswersAndBoolean(gameID);
                socket.emit('answerList', answerList, true);
              }
            }, 1000);
          }
        });
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to retrieve question';
      socket.emit('question_error', reason);
    }
  });
}
