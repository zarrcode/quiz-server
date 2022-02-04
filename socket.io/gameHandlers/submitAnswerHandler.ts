import { type UserSocket } from '../interfaces';
import { evaluateAnswer, getAnswersAndBoolean } from '../../models/answers';

export default async function getQuestionHandler(
  socket: UserSocket,
  gameID: string,
  answer: string,
  username: string,
) {
  try {
    const isAllAnswered = await evaluateAnswer(gameID, username, answer);
    const answerList = await getAnswersAndBoolean(gameID);
    socket.emit('answer_list', answerList, isAllAnswered);
  } catch (err) {
    console.error(err);
    // emit custom 'error'
    const reason = 'failed to submit answer';
    socket.emit('answer_error', reason);
  }
}
