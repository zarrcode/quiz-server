import { type Socket } from 'socket.io';

export interface User {
  sessionID?: string,
  username?: string,
  gameID?: string,
}

export interface UserSocket extends Socket {
  sessionID?: string,
  username?: string,
  gameID?: string,
}

export interface Game {
  username: string,
  title: string,
  difficulty: string,
  category: string[],
  type: string,
  questions: string,
}

export interface GameMetadata {
  Title: string,
  Gamestate: string,
  Assigned_Host: string,
  Format: string,
  No_Questions: string,
  Current_Question: string,
}

export interface CurrentQuestion {
  currentQuestion: string,
  correctAnswer: string,
  incorrectAnswer1?: string,
  incorrectAnswer2?: string,
  incorrectAnswer3?: string,
}

export interface PlayerAnswer {
  username: string,
  answer: string,
  result: string,
}

export interface PlayerScore {
  username: string,
  score: string,
}
