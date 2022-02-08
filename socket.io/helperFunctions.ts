import { type Server } from 'socket.io';
import { type UserSocket } from './interfaces';
import {
  destroyQuiz as destroyGame,
  pushTime as setLastUpdated,
  getTime as getLastUpdated,
} from '../models/quizzes';

export function getGameRoomByID(io: Server, gameID: string) {
  const { rooms } = io.sockets.adapter;
  const room = rooms.get(gameID);
  return room;
}

export function getSocketsInRoom(io: Server, room: Set<string>) {
  const sockets: UserSocket[] = [];
  room.forEach((socketID) => {
    const socket = <UserSocket>io.sockets.sockets.get(socketID);
    sockets.push(socket);
  });
  return sockets;
}

export function getUsersInRoom(io: Server, room: Set<string>) {
  const sockets = getSocketsInRoom(io, room);
  const users = sockets.map((socket) => ({
    sessionID: socket.sessionID,
    username: socket.username,
  }));
  return users;
}

export function getUsersInGame(io: Server, gameID: string) {
  const room = <Set<string>>getGameRoomByID(io, gameID);
  const users = getUsersInRoom(io, room);
  return users;
}

export function disconnectSocketsInGame(io: Server, gameID: string) {
  const room = <Set<string>>getGameRoomByID(io, gameID);
  const sockets = getSocketsInRoom(io, room);
  sockets.forEach((socket) => {
    socket.disconnect();
  });
}

export async function setGameTimeout(io: Server, gameID: string) {
  const allowedInterval = 1000 * 60 * 20; // twenty minutes
  await setLastUpdated(gameID);

  const endGameConditionally = async () => {
    const lastUpdated = await <Promise<number>>getLastUpdated(gameID);
    const now = Date.now();
    const timeElapsed = now - lastUpdated;
    if (timeElapsed > allowedInterval) {
      await destroyGame(gameID);
      disconnectSocketsInGame(io, gameID);
    }
  };

  setTimeout(() => endGameConditionally(), allowedInterval);
}

export default {
  getGameRoomByID,
  getSocketsInRoom,
  getUsersInRoom,
  getUsersInGame,
  disconnectSocketsInGame,
  setGameTimeout,
};
