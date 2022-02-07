import { type Server } from 'socket.io';
import { type User, type PlayerAnswer, type UserSocket } from '../interfaces';
import { getUsersInGame } from '../helperFunctions';
import { getAnswersAndBoolean as getPlayerAnswers } from '../../models/answers';

function formatUserData(users: User[], playerAnswers: PlayerAnswer[]) {
  const userData = users.map((user) => {
    const playerAnswer = playerAnswers
      .find((playerAnswer) => playerAnswer.username === user.username);
    return {
      username: user.username,
      sessionID: user.sessionID,
      answer: playerAnswer?.answer,
      result: playerAnswer?.result,
    };
  });

  return userData;
}

export default async function usersEvent(io: Server, socket: UserSocket, gameID: string) {
  const users = <User[]>getUsersInGame(io, gameID);
  const playerAnswers = await <Promise<PlayerAnswer[]>>getPlayerAnswers(gameID);

  // TODO: add score

  const userData = formatUserData(users, playerAnswers);

  console.log(userData);

  socket.emit('users', userData);
}
