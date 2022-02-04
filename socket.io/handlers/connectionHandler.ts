import { Server } from 'socket.io';
import { getUsersInGame } from '../helperFunctions';
import { type UserSocket } from '../interfaces';
import { getQuiz as getGameData } from '../../models/quizzes';

export default async function connectionHandler(io: Server, socket: UserSocket) {
  console.log(`${socket.username} connected`);

  // send session for storing in client local storage
  socket.emit('session', socket.sessionID);

  const { gameID } = socket;

  if (!gameID) return; // if no game ID, user is connecting for the first time

  // rejoin reconnecting users to ongoing games
  const users = getUsersInGame(io, gameID);
  socket.emit('users', users);

  socket.join(gameID);

  const gameData = await getGameData(gameID);
  socket.emit('game_data', gameData);
}
