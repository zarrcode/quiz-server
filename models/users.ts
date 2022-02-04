import { v4 as uuid } from 'uuid';
import client from '../db';
import { addPlayerToScoreboard } from './scoreboard';
// import getQuestions from '../controllers/questions/index'

export const createSession = async (username: string) => {
  try {
    const userID = uuid();
    const values = { username };
    await client.hSet(userID, values);
    console.log(userID);
    return userID;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const findSession = async (userID: string) => {
  try {
    const session = await client.hGetAll(userID);
    if (session.username) {
      return session;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const destroySession = async (userID: string) => {
  try {
    await client.del(userID);
    console.log('client deleted');
    return true;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const addPlayerToGameList = async (gameID: string, userID: string) => {
  const savedList = await client.lPush(`${gameID}PlayerList`, userID);
  // console.log(savedList);
};

export const addGameIDToSession = async (userID: string, gameID: string) => {
  try {
    await client.hSet(userID, 'gameID', gameID);
    const user = await client.hGetAll(userID);
    console.log('user', user)
    addPlayerToGameList(gameID, user.username);
    addPlayerToScoreboard(gameID, user.username);
    await client.hIncrBy(gameID, 'Active_Players', 1);
    return user;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export default {
  createSession, findSession, destroySession, addGameIDToSession, addPlayerToGameList,
};

// console.log(createSession('david'));
// console.log(findSession('c53b0bd4-0401-4112-953c-386bbe8033b5'));
// console.log(addGameIDToSession('f75f03cf-7d01-4443-b945-c4f30864a932', 'GIBM'));
// console.log(findSession('c53b0bd4-0401-4112-953c-386bbe8033b5'));
