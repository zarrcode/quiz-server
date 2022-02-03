import { type UserSocket } from '../interfaces';
import { evaluateAnswer, getAnswersAndBoolean } from '../../models/answers';

const dummyAnswerList = [
  { username: 'ross', answer: 'gladiator', score: 4 },
  { username: 'sam', answer: 'godfather', score: 2 },
];

export default async function getQuestionHandler(
  socket: UserSocket,
  gameID: string,
  answer: string,
  username: string,
) {
  try {
    await evaluateAnswer(gameID, username, answer);
    // await getAnswersAndScores(gameID);
    socket.emit('answer_list', dummyAnswerList);
  } catch (err) {
    console.error(err);
    // emit custom 'error'
    const reason = 'failed to submit answer';
    socket.emit('answer_error', reason);
  }
}
