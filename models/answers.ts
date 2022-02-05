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
  const answerList = await client.hGetAll(`${gameID}AnswerList`);
  if (answerList) {
    const arr: { [x: string]: string; }[] = [];
    Object.keys(answerList).forEach((el) => {
      arr.push({ username: el, answer: answerList[el].split(':')[0], result: answerList[el].split(':')[1] });
    });
    // console.log('answer list', arr);
    return arr;
  }
};

export const evaluateAnswer = async (
  gameID: string,
  username: string,
  answer: string,
) => {
  try {
    const quiz = await client.hGetAll(gameID);
    const currentQuestionNumber = quiz.Current_Question;
    const correctAnswer = quiz[`Question${currentQuestionNumber}[answer]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    // eslint-disable-next-line max-len
    const similarity = stringSimilarity.compareTwoStrings(correctAnswer.toLowerCase(), answer.toLowerCase());
    // if (similarity > 0.656) updateScoreboard(gameID, username);
    addToAnswerList(gameID, username, answer, correctAnswer, similarity);
    const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
    // console.log(current, Number(quiz.Active_Players));
    if (current >= Number(quiz.Active_Players)) return true;
    return false;
  } catch (err) {
    return err;
  }
};

// evaluateAnswer('GIBM', 'oscar', '21st August');
// evaluateAnswer('GIBM', 'angus', '29st September');
// evaluateAnswer('GIBM', 'David', 'August 21');
getAnswersAndBoolean('GIBM');

// const similarity1 = stringSimilarity.compareTwoStrings('princess leia', 'leia');

// console.log(similarity1);
export default { evaluateAnswer, getAnswersAndBoolean, addToAnswerList };
