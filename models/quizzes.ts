import client from '../db'
import getQuestions from '../controllers/questions/index'
import { v4 as uuid } from 'uuid';
import registerHost from './users'


//fakequizObject
const newQuiz = {
  title:'reubys quizzola',
  difficulty: 'easy',
  questions: 10,
  category: 'sports',
  username: 'reubiano'
}

const generateQuiz = async (obj) => {

  let quizCode = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 4; i++)
    quizCode += letters.charAt(Math.floor(Math.random() * letters.length));

  //retrieve questions from API function and incorporate into quiz object

  //save quiz to db
  await client.hSet(quizCode, obj)

  //registerHost on system by calling register Host Function, that takes a userID, and quizID, and Username
  const hostID = uuid();
  registerHost(username, hostID, quizCode)


  return quizCode

}




const nextQuestion = async () => {

  //send next question and indicator
}


const submitAnswer = async () => {
  //save answer, update player score, send updated answer no. list
  //once last player has sumbitted, invoke generateAnswerList

}

const changeAnswers = async () => {

}


const generateAnswerList = async () => {

  //send answer list and indicator to change to answer screen
}


const generateScoreboard = async () => {
  //once receives confirmation, send scoreboard

}










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