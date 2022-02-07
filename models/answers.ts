import { decode } from 'html-entities';
import client from '../db';
import { updateScoreboard } from './scoreboard';

const stringSimilarity = require('string-similarity');

const addToAnswerList = async (
  gameID: string,
  username: string,
  answer: string,
  correctAnswer: string,
  similarity: number,
) => {
  if (similarity > 0.656) {
    await client.hSet(`${gameID}AnswerList`, username, `${answer}:true`);
  } else {
    await client.hSet(`${gameID}AnswerList`, username, `${answer}:false`);
  }
};

export const getAnswersAndBoolean = async (gameID:string) => {
  try {
    const answerList = await client.hGetAll(`${gameID}AnswerList`);
    if (answerList) {
      const arr: { [x: string]: string; }[] = [];
      Object.keys(answerList).forEach((el) => {
        arr.push({ username: el, answer: answerList[el].split(':')[0], result: answerList[el].split(':')[1] });
      });
      return arr;
    }
    return undefined;
  } catch (err) {
    return err;
  }
};

export const evaluateAnswer = async (
  gameID: string,
  username: string,
  answer: string,
) => {
  try {
    await client.hSet(gameID, 'Gamestate', 'answers');
    const quiz = await client.hGetAll(gameID);
    const currentQuestionNumber = quiz.Current_Question;
    const correctAnswer = decode(quiz[`Question${currentQuestionNumber}[answer]`]);
    // eslint-disable-next-line max-len
    const similarity = stringSimilarity.compareTwoStrings(correctAnswer.toLowerCase(), answer.toLowerCase());
    addToAnswerList(gameID, username, answer, correctAnswer, similarity);
    const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
    if (current >= Number(quiz.Active_Players)) { return true; }
    return false;
  } catch (err) {
    return err;
  }
};

export const haveAllAnswered = async (gameID: string) => {
  try {
    const quiz = await client.hGetAll(gameID);
    const answered = quiz.Submitted_Answers;
    const activePlayers = quiz.Active_Players;
    if (answered >= activePlayers) return true;
    return false;
  } catch (err) {
    return err;
  }
};

// evaluateAnswer('GIBM', 'oscar', '21st August');
// evaluateAnswer('GIBM', 'angus', '29st September');
// evaluateAnswer('GIBM', 'David', 'August 21');
// getAnswersAndBoolean('GIBM');

// const similarity1 = stringSimilarity.compareTwoStrings('princess leia', 'leia');

// console.log(similarity1);
export default { evaluateAnswer, getAnswersAndBoolean, addToAnswerList };
