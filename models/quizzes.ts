import client from '../db';
import getQuestions from '../controllers/questions/index';
import getToken from '../controllers/token/index';

// fakequizObject
const newQuiz = {
  title: 'reubys quizzola',
  difficulty: 'easy',
  type: '',
  questions: 10,
  category: ['Sports'],
  username: 'reubiano',
};

function quizCodeGenerator() {
  let quizCode = '';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i += 1) {
    quizCode += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return quizCode;
}

function formatQuestions(
  array: string[] | undefined,
  type: string,
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
    for (let i = 0; i < array.length; i += 2) {
      formatted.push(`Question${question}[question]`);
      formatted.push(array[i]);
      formatted.push(`Question${question}[answer]`);
      formatted.push(array[i + 1]);
      question += 1;
    }
  }
  return formatted;
}

const generateQuiz = async (obj: any, hostID: string) => {
  try {
    const gameID = quizCodeGenerator();
    console.log('quizCode', gameID);
    console.log('format',obj.Format)

    const token = await getToken();

    if (token) {
      const questions: string[] | undefined = await getQuestions(
        obj.questions,
        token,
        obj.category,
        obj.difficulty,
        obj.type,
      );
      console.log(questions);
      const formattedQuestions = formatQuestions(questions, obj.Format);
      console.log('formattedQuestions', formattedQuestions)

      // const hostID = await registerHost(obj.username, quizCode);
      // need to make sure we add host to game list
      // need to make sure we add host to scoreboard
      // need to make sure we create host user

      const quizArr = [
        'Title', obj.title,
        'Host_Name', obj.username,
        'Creating_Host', hostID,
        'Assigned_Host', hostID,
        'Format', obj.type,
        'Active_Players', 0,
        'Submitted_Answers', 0,
        'No_Questions', obj.questions,
        'Current_Question', 1,
        'RenderedScreen', 'Lobby',
        ...formattedQuestions,
      ];
      await client.hSet(gameID, quizArr);
      return gameID;
    } return undefined;
  } catch (error) {
    return error;
  }
};

const quizExists = async (gameID: string) => {
  try {
    const quizExists = await client.hGetAll(gameID);
    console.log(quizExists);
    if (quizExists) return true;
    return false;
  } catch (err) {
    return err;
  }
};

const getQuiz = async (gameID: string) => {
  try {
    const quiz = await client.hGetAll(gameID);
    return quiz;
  } catch (err) {
    return err;
  }
};

const getCurrentQuestion = async (gameID: string) => {
  try {
    const quiz = await client.hGetAll(gameID);
    const format = quiz.Format;
    const currentQuestionNumber = quiz.Current_Question;
    const currentQuestion = quiz[`Question${currentQuestionNumber}[question]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    const correctAnswer = quiz[`Question${currentQuestionNumber}[answer]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    if (currentQuestion && format !== 'multiple') {
      console.log(currentQuestion, correctAnswer);

      return { currentQuestion, correctAnswer };
    }
    const incorrectAnswer1 = quiz[`Question${currentQuestionNumber}[incorrectAnswer1]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    const incorrectAnswer2 = quiz[`Question${currentQuestionNumber}[incorrectAnswer2]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    const incorrectAnswer3 = quiz[`Question${currentQuestionNumber}[incorrectAnswer3]`].replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&shy;/g, '-');
    // eslint-disable-next-line max-len
    console.log(currentQuestion, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3)
    return {
      currentQuestion, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
// getCurrentQuestion('GIBM');
console.log(getCurrentQuestion('GIBM'));
