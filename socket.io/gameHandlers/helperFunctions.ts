import { type Server } from 'socket.io';
import { type UserSocket } from '../interfaces';

export function getGameRoomByID(io: Server, gameID: string) {
  const { rooms } = io.sockets.adapter;
  const room = rooms.get(gameID);
  return room;
}

export function getUsersInRoom(io: Server, room: Set<string>) {
  const sockets: UserSocket[] = [];
  room.forEach((socketID) => {
    const socket = <UserSocket>io.sockets.sockets.get(socketID);
    sockets.push(socket);
  });
  const users = sockets.map((socket) => ({
    sessionID: socket.sessionID,
    username: socket.username,
  }));
  return users;
}

export default {
  getGameRoomByID,
  getUsersInRoom,
};
