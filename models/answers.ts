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
    if (Number(answered) >= Number(activePlayers)) return true;
    return false;
  } catch (err) {
    return err;
  }
};

export default { evaluateAnswer, getAnswersAndBoolean, addToAnswerList };
