/* eslint-disable no-unused-vars */

import { type Game as GameOptions } from '../interfaces';

export interface Game {
  gameID: string,
  hostID: string,
  title: string,
}

const gameStore: Game[] = [];

export function createGame(hostID: string, options: GameOptions) {
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
  const game = getGame(gameID);
  return !!game;
}

export default {
  createGame,
  getGame,
  gameExists,
};
