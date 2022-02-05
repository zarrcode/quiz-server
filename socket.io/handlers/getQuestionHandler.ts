import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { getCurrentQuestion } from '../../models/quizzes';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function getQuestionHandler(io: Server, socket: UserSocket) {
  socket.on('retrieve_question', async (gameID) => {
    try {
      const questionAndAnswers = await getCurrentQuestion(gameID);
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('new_question', questionAndAnswers));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to retrieve question';
      socket.emit('question_error', reason);
    }
  });
}
