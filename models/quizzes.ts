import { v4 as uuid } from 'uuid';
import client from '../db';
import getQuestions from '../controllers/questions/index';
import getToken from '../controllers/token/index';
import registerHost from './users';

// fakequizObject
const newQuiz = {
  title: 'reubys quizzola',
  difficulty: 'easy',
  type: 'multiple',
  questions: 10,
  category: 'sports',
  username: 'reubiano',
};

const quizCodeGenerator = function () {
  let quizCode = '';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i += 1) {
    quizCode += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return quizCode;
};

const formatQuestions = function (
  array: string[] | undefined,
  type: string,
  amount: number
) {
  const formatted = [];
  if (type === 'multiple' && array) {
    let question = 1;
    for (let i = 0; i < array.length; i += 5) {
      formatted.push(`Question${question}[question]`);
      formatted.push(array[i]);
      formatted.push(`Question${question}[answer]`);
      formatted.push(array[i + 1]);
      formatted.push(`Question${question}[incorrectAnswer1]`);
      formatted.push(array[i + 2]);
      formatted.push(`Question${question}[incorrectAnswer2]`);
      formatted.push(array[i + 3]);
      formatted.push(`Question${question}[incorrectAnswer3]`);
      formatted.push(array[i + 4]);
      question += 1;
    }
  } else if (array) {
    let question = 1;
    for (let i = 0; i < array.length; i += 5) {
      formatted.push(`Question${question}[question]`);
      formatted.push(array[i]);
      formatted.push(`Question${question}[answer]`);
      formatted.push(array[i + 1]);
      question += 1;
    }
  }
  return formatted;
};

const generateQuiz = async (obj: any) => {
  const quizCode = quizCodeGenerator();
  console.log(quizCode);

  const token = await getToken();

  if (token) {
    const questions: string[] | undefined = await getQuestions(
      obj.questions,
      token,
      9,
      obj.difficulty,
      obj.type,
    );
    const formattedQuestions = formatQuestions(questions, 'multiple', 10);

    const hostID = await registerHost(obj.username, quizCode);
    // need to make sure we add host to game list
    // need to make sure we add host to scoreboard
    // need to make sure we create host user

    const quizArr = [
      'Title', obj.title,
      'Host_Name', obj.username,
      'Creating_Host', hostID,
      'Assigned_Host', hostID,
      'Active_Players', 1, // note we start with 1 as we are including the host here
      'Submitted_Answers', 0,
      'No_Questions', obj.questions,
      'Current_Question', 1,
      'RenderedScreen', 'Lobby',
      ...formattedQuestions,
    ];
    console.log(quizArr);
    await client.hSet(quizCode, quizArr);
    return quizCode;
  } return undefined;
};

const nextQuestion = async (gameID: string) => {

  // send next question and indicator for next question,
  // once final scoreboard has been rendered and you're moving on
  // take current question from db, current question
};

// 'Title'
// Ross's Quiz
// 'Creating Host'
// a78176
// 'Assigned Host'
// 682s4
// 'Active Players'
// 6
// 'Submitted Answers'
// 6
// 'NoQuestions'
// 10
// 'Question1[question]'
// Who won the Superbowl?
// 'Question1[answer]'
// New England Patriots
// 'Question2[question]'
// ...
// 'Question2[answer]'
// ... etc.
// 'CurrentQuestion'
// 3
// 'RenderedScreen'
// Leaderboard
