/* eslint-disable no-unused-vars */

import { GameCreateOptions } from '../interfaces';

export interface Game {
  gameID: string,
  hostID: string,
  title: string,
}

const gameStore: Game[] = [];

export function createGame(hostID: string, options: GameCreateOptions) {
  const gameID = 'Hello';
  const game = {
    gameID,
    hostID,
    title: options.title,
  };
  gameStore.push(game);
  return game;
}

export function getGame(gameID: string) {
  const game = gameStore.find((game) => game.gameID === gameID);
  return game;
}

export function gameExists(gameID: string) {
  console.log('hello');
  const game = getGame(gameID);
  return !!game;
}

export default {
  createGame,
  getGame,
  gameExists,
};
