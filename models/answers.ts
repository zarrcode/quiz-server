import client from '../db';
import { updateScoreboard } from './scoreboard';

const addToAnswerList = async (
  gameID: string,
  username: string,
  answer: string,
  correctAnswer: string,
) => {
  await client.hSet(`${gameID}AnswerList`, 'Correct_Answer', correctAnswer);
  const answerList = await client.hSet(`${gameID}AnswerList`, username, answer);
  console.log('answerlist function', answerList);
  return answerList;
};

const generateAnswerList = async (gameID:string) => {
  console.log('Hitting generate answer list. Need to actually tell front end to render');
  const answerList = await client.hGetAll(`${gameID}AnswerList`);
  return answerList;
};

const evaluateAnswer = async (
  gameID: string,
  username: string,
  answer: string,
) => {
  // get quiz and check answer
  const quiz = await client.hGetAll(gameID);
  const currentQuestionNumber = await client.hGet(gameID, 'Current_Question');
  const correctAnswer = quiz[`Question${currentQuestionNumber}[answer]`];
  if (correctAnswer === answer) updateScoreboard(gameID, username);
  addToAnswerList(gameID, username, answer, correctAnswer);
  const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
  if (current >= Number(quiz.Active_Players)) generateAnswerList(gameID);
};

// evaluateAnswer('XYMG', 'Angus', 1, 'Steve Buscemi');
