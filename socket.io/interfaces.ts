import { type Socket } from 'socket.io';

export interface UserSocket extends Socket {
  sessionID?: string,
  username?: string,
  gameID?: string,
}

export interface GameCreatePayload {
  username: string,
  title: string,
  difficulty: string,
  category: string,
  type: string,
  questions: string,
}
