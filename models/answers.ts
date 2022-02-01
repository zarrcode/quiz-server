import client from '../db'
import { addPlayerToScoreboard, updateScoreboard, renderScoreboard }  from './scoreboard'





const evaluateAnswer = async (gameID:string, username:string, questionNumber:number, answer:string) => {
  //get quiz and check answer
  const quiz = await client.hGetAll(gameID);
  const correct_answer = quiz[`Question${questionNumber}[answer]`]
  correct_answer === answer ? updateScoreboard(gameID, username): null;

  addToAnswerList(gameID,username,answer,correct_answer);

  const current = await client.hIncrBy(gameID, 'Submitted_Answers', 1);
  current >= Number(quiz.Active_Players) ? generateAnswerList(gameID) : null;

}


const addToAnswerList = async (gameID:string, username:string, answer:string, correct_answer:string) => {

  await client.hSet(gameID+'AnswerList', 'Correct_Answer', correct_answer);
  const answerList = await client.hSet(gameID+'AnswerList', username, answer);
  console.log('answerlist function', answerList)

}


const generateAnswerList = async (gameID:string) => {

  console.log('Hitting generate answer list. Need to actually tell front end to render')
  const answerList = await client.hGetAll(gameID+'AnswerList');
  await client.hSet(gameID, 'Submitted_Answers', 0)
  return answerList

}


evaluateAnswer('XYMG', 'Angus', 1, 'Steve Buscemi')

