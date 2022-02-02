/* eslint-disable no-unused-vars */
import { GameCreatePayload } from './interfaces';

export function createGame(options: GameCreatePayload) {
  return 'ABCD';
}

export function checkGameExists(gameID: string) {
  return true;
}

export default {
  createGame,
  checkGameExists,
};
