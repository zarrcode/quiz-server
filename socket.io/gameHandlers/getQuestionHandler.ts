import { type UserSocket } from '../interfaces';
import { getCurrentQuestion } from '../../models/quizzes';

export default async function getQuestionHandler(socket: UserSocket, gameID: string) {
  try {
    const questionAndAnswers = await getCurrentQuestion(gameID);
    socket.emit('new_question', questionAndAnswers);
  } catch (err) {
    console.error(err);
    // emit custom 'error'
    const reason = 'failed to retrieve question';
    socket.emit('question_error', reason);
  }
}
