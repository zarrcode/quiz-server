/* eslint-disable no-unused-vars */
import { GameCreateOptions } from '../interfaces';

export function createGame(options: GameCreateOptions) {
  return 'Hello';
}

export function gameExists(gameID: string) {
  return gameID === 'Hello';
}

export default {
  createGame,
  gameExists,
};
