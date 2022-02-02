import client from '../db';
// eslint-disable-next-line no-unused-vars
import { addPlayerToScoreboard, updateScoreboard, renderScoreboard } from './scoreboard';

const addToAnswerList = async (
  gameID: string,
  username: string,
  answer: string,
  correctAnswer: string,
) => {
  await client.hSet(`${gameID}AnswerList`, 'Correct_Answer', correctAnswer);
  const answerList = await client.hSet(`${gameID}AnswerList`, username, answer);
  console.log('answerlist function', answerList);
};

const generateAnswerList = async (gameID:string) => {
  console.log('Hitting generate answer list. Need to actually tell front end to render');
  const answerList = await client.hGetAll(`${gameID}AnswerList`);
  await client.hSet(gameID, 'Submitted_Answers', 0);
  return answerList;
};

const evaluateAnswer = async (
  gameID: string,
  username: string,
  questionNumber: number,
  answer: string,
) => {
  // get quiz and check answer
  const quiz = await client.hGetAll(gameID);
  const correctAnswer = quiz[`Question${questionNumber}[answer]`];
  if (correctAnswer === answer) updateScoreboard(gameID, username);
  addToAnswerList(gameID, username, answer, correctAnswer);
  const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
  if (current >= Number(quiz.Active_Players)) generateAnswerList(gameID);
};

evaluateAnswer('XYMG', 'Angus', 1, 'Steve Buscemi');
