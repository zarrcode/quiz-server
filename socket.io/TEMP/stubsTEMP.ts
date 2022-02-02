/* eslint-disable no-unused-vars */
import { GameCreatePayload } from '../interfaces';

export function createGame(options: GameCreatePayload) {
  return 'Hello';
}

export function gameExists(gameID: string) {
  return gameID === 'Hello';
}

export default {
  createGame,
  gameExists,
};
