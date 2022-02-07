import {
  type UserSocket,
  type GameData,
  type CurrentQuestion,
  type PlayerAnswer,
} from '../interfaces';
import { getQuiz as getGameData, getCurrentQuestion } from '../../models/quizzes';
import { getAnswersAndBoolean as getPlayerAnswers } from '../../models/answers';

export default async function gameDataEvent(socket: UserSocket, gameID: string) {
  const response = await <Promise<GameData>>getGameData(gameID);

  console.log(response);

  const isHost = socket.sessionID === response.Assigned_Host;
  const isMultipleChoice = response.Format === 'multiple';
  const currentQuestion = await <Promise<CurrentQuestion>>getCurrentQuestion(gameID);
  const playerAnswers = await <Promise<PlayerAnswer[]>>getPlayerAnswers(gameID);

  const playersCorrectlyAnswered = playerAnswers
    .filter((playerAnswer) => playerAnswer.result === 'true')
    .map((playerAnswer) => playerAnswer.username);

  const gameData = {
    title: response.Title,
    gameState: response.Gamestate,
    isHost,
    isMultipleChoice,
    currentQuestion: currentQuestion.currentQuestion,
    correctAnswer: currentQuestion.correctAnswer,
    multipleChoiceAnswers: [
      currentQuestion.correctAnswer,
      currentQuestion.incorrectAnswer1,
      currentQuestion.incorrectAnswer2,
      currentQuestion.incorrectAnswer3,
    ],
    playersCorrectlyAnswered,
  };

  console.log(gameData);
  socket.emit('game_data', gameData);
}

// Current_Question: "1"
// Format: "not multiple"
// Host_Name: "Zou"
// No_Questions: "6"
// Question1[answer]: "George Eliot"
// Question1[question]: "What was the pen name of novelist, Mary Ann Evans?"
// Question2[answer]: "Antoine de Saint-Exup&eacute;ry"
// Question2[question]: "The book &quot;The Little Prince&quot; was written by..."
// Question3[answer]: "9"
// Question3[question]: "In the novel &quot;Lord of the Rings&quot;, how many rings of power were given to the race of man?"
// Question4[answer]: "The Dresden Files"
// Question4[question]: "What book series published by Jim Butcher follows a wizard in modern day Chicago?"
// Question5[answer]: "Saphira"
// Question5[question]: "What is the name of Eragon&#039;s dragon in &quot;Eragon&quot;?"
// Question6[answer]: "Steven Erikson"
// Question6[question]: "Who is the author of the series &quot;Malazan Book of the Fallen&quot;?"
// Submitted_Answers: "0"
// Timestamp: "1644227597738"
// Title: "My Quiz"

// [Object: null prototype] {
//   Title: '',
//   Host_Name: 'Zou',
//   Creating_Host: '6236a5ac-9c9a-401c-8fe2-fe3692c3e671',
//   Assigned_Host: '6236a5ac-9c9a-401c-8fe2-fe3692c3e671',
//   Format: 'multiple',
//   Active_Players: '1',
//   Submitted_Answers: '0',
//   No_Questions: '6',
//   Current_Question: '1',
//   Gamestate: 'question',
//   Timestamp: '1644228606635',
//   'Question1[question]': 'Which actress married Michael Douglas in 2000?',
//   'Question1[answer]': 'Catherine Zeta-Jones',
//   'Question1[incorrectAnswer1]': 'Ruth Jones',
//   'Question1[incorrectAnswer2]': 'Pam Ferris',
//   'Question1[incorrectAnswer3]': 'Sara Sugarman',
//   'Question2[question]': 'What does film maker Dan Bell typically focus his films on?',
//   'Question2[answer]': 'Abandoned Buildings and Dead Malls',
//   'Question2[incorrectAnswer1]': 'Historic Landmarks',
//   'Question2[incorrectAnswer2]': 'Action Films',
//   'Question2[incorrectAnswer3]': 'Documentaries ',
//   'Question3[question]': 'Gwyneth Paltrow has a daughter named...?',
//   'Question3[answer]': 'Apple',
//   'Question3[incorrectAnswer1]': 'Lily',
//   'Question3[incorrectAnswer2]': 'French',
//   'Question3[incorrectAnswer3]': 'Dakota',
//   'Question4[question]': 'Aubrey Graham is better known as',
//   'Question4[answer]': 'Drake',
//   'Question4[incorrectAnswer1]': 'Travis Scott',
//   'Question4[incorrectAnswer2]': 'Lil Wayne',
//   'Question4[incorrectAnswer3]': '2 Chainz',
//   'Question5[question]': 'By which name is Ramon Estevez better known as?',
//   'Question5[answer]': 'Martin Sheen',
//   'Question5[incorrectAnswer1]': 'Charlie Sheen',
//   'Question5[incorrectAnswer2]': 'Ramon Sheen',
//   'Question5[incorrectAnswer3]': 'Emilio Estevez',
//   'Question6[question]': 'What was James Coburn&#039;s last film role before his death?',
//   'Question6[answer]': 'American Gun',
//   'Question6[incorrectAnswer1]': 'Monsters Inc',
//   'Question6[incorrectAnswer2]': 'Texas Rangers',
//   'Question6[incorrectAnswer3]': 'Snow Dogs'
// }