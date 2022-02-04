import { Server } from 'socket.io';
import { getGameRoomByID, getUsersInRoom } from './gameHandlers/helperFunctions';
import { type UserSocket } from './interfaces';
import { addSocketListeners } from './socketListeners';
import { getQuiz as getGame } from '../models/quizzes';

function sendSession(socket: UserSocket) {
  socket.emit('session', socket.sessionID);
}

function sendUsers(io: Server, socket: UserSocket, gameID: string) {
  // send all users in room
  const room = getGameRoomByID(io, gameID);
  const users = getUsersInRoom(io, room!);
  socket.emit('users', users);
}

async function sendGameData(socket: UserSocket, gameID: string) {
  // send game data
  socket.join(gameID);
  const game = await getGame(gameID);
  socket.emit('game_rejoined', game);
}

export function connectionHandler(io: Server, socket: UserSocket) {
  console.log(`${socket.username} connected`);

  addSocketListeners(io, socket);
  sendSession(socket);

  const { gameID } = socket;
  if (gameID) {
    sendUsers(io, socket, gameID);
    sendGameData(socket, gameID);
  }
}

export default { connectionHandler };
