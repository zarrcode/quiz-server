import { v4 as uuid, v4 } from 'uuid';
import client from '../db';
// import getQuestions from '../controllers/questions/index'

const createSession = async (username: string) => {
  const userID = uuid();
  const values = { username };
  await client.hSet(userID, values);

  const result = {
    userID,
    username,
    gameID: null,
  };
  console.log(result);
  return result;
};

const addToSession = async (gameID: string, userID: string) => {
  try {
    const set = await client.hSet(userID, 'gameID', gameID);
    return set;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// eslint-disable-next-line consistent-return
// const destroySession = async (userID: string) => {
//   try {
//     await client.del(userID);
//   } catch (err) {
//     throw err;
//   }
// };

const registerHost = async (username: string, gameID: string) => {
  const hostID = uuid();
  const values = { username, gameID };
  await client.hSet(hostID, values);
  return hostID;
};

const registerPlayer = async (quizCode: string, username: string) => {
  // check quiz exists
  const check = await client.hGetAll(quizCode);
  if (!check) console.log('Quiz does not exist');
  // create player hash with quiz, and unique userID
  // check if they are final user to join
  // make sure you increase active game players
};

const addPlayerToGameList = async (gameID: string, userID: string) => {
  const savedList = await client.lPush(`${gameID}PlayerList`, userID);
  console.log(savedList);
};

const userDisconnects = async () => {

};

const userReconnects = async () => {

};

export default registerHost;
