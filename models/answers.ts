import client from '../db';
import { updateScoreboard } from './scoreboard';

const stringSimilarity = require('string-similarity');

const addToAnswerList = async (
  gameID: string,
  username: string,
  answer: string,
  correctAnswer: string,
) => {
  await client.hSet(`${gameID}AnswerList`, 'Correct_Answer', correctAnswer);
  const answerList = await client.hSet(`${gameID}AnswerList`, username, answer);
  return answerList;
};

const generateAnswerList = async (gameID:string) => {
  const answerList = await client.hGetAll(`${gameID}AnswerList`);
  return answerList;
};

const evaluateAnswer = async (
  gameID: string,
  username: string,
  answer: string,
) => {
  const quiz = await client.hGetAll(gameID);
  const currentQuestionNumber = quiz.Current_Question;
  const correctAnswer = quiz[`Question${currentQuestionNumber}[answer]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
  // eslint-disable-next-line max-len
  const similarity = stringSimilarity.compareTwoStrings(correctAnswer.toLowerCase(), answer.toLowerCase());
  if (similarity > 0.656) updateScoreboard(gameID, username);
  addToAnswerList(gameID, username, answer, correctAnswer);
  const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
  if (current >= Number(quiz.Active_Players)) generateAnswerList(gameID);
};

const similarity1 = stringSimilarity.compareTwoStrings('princess leia', 'leia');

console.log(similarity1);
