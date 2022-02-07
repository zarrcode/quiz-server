import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';
import { evaluateAnswer, getAnswersAndBoolean } from '../../models/answers';
import { getGameRoomByID, getSocketsInRoom } from '../helperFunctions';

export default function submitAnswerHandler(io: Server, socket: UserSocket) {
  socket.on('submit_answer', async (gameID, answer, username) => {
    try {
      const isAllAnswered = await evaluateAnswer(gameID, username, answer);
      const answerList = await getAnswersAndBoolean(gameID);
      const room = getGameRoomByID(io, gameID);
      if (room) {
        const sockets = getSocketsInRoom(io, room);
        sockets.forEach((socket) => socket.emit('answer_list', answerList, isAllAnswered));
      }
    } catch (err) {
      console.error(err);
      // emit custom 'error'
      const reason = 'failed to submit answer';
      socket.emit('submit_answer_error', reason);
    }
  });
}
