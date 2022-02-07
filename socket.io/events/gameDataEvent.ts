import {
  type UserSocket,
  type GameMetadata,
  type CurrentQuestion,
  type PlayerAnswer,
} from '../interfaces';
import {
  getQuiz as getGameData,
  getCurrentQuestion,
} from '../../models/quizzes';
import {
  getAnswersAndBoolean as getPlayerAnswers,
  haveAllAnswered as checkAllAnswered,
} from '../../models/answers';

function formatGameData(
  socket: UserSocket,
  gameMetadata: GameMetadata,
  currentQuestionData: CurrentQuestion,
  playerAnswers: PlayerAnswer[],
  isAllAnswered: boolean,
) {
  const title = gameMetadata.Title;
  const gameState = gameMetadata.Gamestate;
  const isHost = socket.sessionID === gameMetadata.Assigned_Host;
  const isGameOver = gameMetadata.Current_Question === gameMetadata.No_Questions;
  const { currentQuestion } = currentQuestionData;
  const { correctAnswer } = currentQuestionData;
  const isMultipleChoice = gameMetadata.Format === 'multiple';

  const multipleChoiceAnswers = [
    currentQuestionData.correctAnswer,
    currentQuestionData.incorrectAnswer1,
    currentQuestionData.incorrectAnswer2,
    currentQuestionData.incorrectAnswer3,
  ];

  const playersCorrectlyAnswered = playerAnswers
    .filter((playerAnswer) => playerAnswer.result === 'true')
    .map((playerAnswer) => playerAnswer.username);

  const gameData = {
    title,
    gameState,
    isHost,
    isGameOver,
    currentQuestion,
    correctAnswer,
    isMultipleChoice,
    multipleChoiceAnswers,
    playersCorrectlyAnswered,
    isAllAnswered,
  };

  return gameData;
}

export default async function gameDataEvent(socket: UserSocket, gameID: string) {
  const gameMetadata = await <Promise<GameMetadata>>getGameData(gameID);
  const currentQuestionData = await <Promise<CurrentQuestion>>getCurrentQuestion(gameID);
  const playerAnswers = await <Promise<PlayerAnswer[]>>getPlayerAnswers(gameID);
  const isAllAnswered = await <Promise<boolean>>checkAllAnswered(gameID);

  const gameData = formatGameData(
    socket,
    gameMetadata,
    currentQuestionData,
    playerAnswers,
    isAllAnswered,
  );

  socket.emit('game_data', gameData);
}
