import { type Server } from 'socket.io';
import {
  type User,
  type PlayerAnswer,
  type UserSocket,
  type PlayerScore,
} from '../interfaces';
import { getUsersInGame } from '../helperFunctions';
import { getAnswersAndBoolean as getPlayerAnswers } from '../../models/answers';
import { renderScoreboard as getPlayerScores } from '../../models/scoreboard';

function formatUserData(users: User[], playerAnswers: PlayerAnswer[], playerScores: PlayerScore[]) {
  const userData = users.map((user) => {
    const playerAnswer = playerAnswers
      .find((playerAnswer) => playerAnswer.username === user.username);
    const playerScore = playerScores
      .find((playerScore) => playerScore.username === user.username);
    return {
      username: user.username,
      sessionID: user.sessionID,
      answer: playerAnswer?.answer,
      result: playerAnswer?.result,
      score: playerScore?.score,
    };
  });

  return userData;
}

export default async function usersEvent(io: Server, socket: UserSocket, gameID: string) {
  const users = <User[]>getUsersInGame(io, gameID);
  const playerAnswers = await <Promise<PlayerAnswer[]>>getPlayerAnswers(gameID);
  const playerScores = await getPlayerScores(gameID);

  const userData = formatUserData(users, playerAnswers, playerScores);

  socket.emit('users', userData);
}
