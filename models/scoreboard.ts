import client from '../db';

export const addPlayerToScoreboard = async (gameID: string, username: string) => {
  await client.hSet(`${gameID}Scoreboard`, username, 0);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log('scoreboard', scoreboard);
};

// need to be prepared if this gets passed as an array
export const updateScoreboard = async (gameID:string, username: string | string[]) => {
  if (Array.isArray(username)) {
    username.map((el) => client.hIncrBy(`${gameID}Scoreboard`, el, 1));
  } else {
    client.hIncrBy(`${gameID}Scoreboard`, username, 1);
  }
};

export const renderScoreboard = async (gameID:string) => {
  await client.hSet(gameID, 'Submitted_Answers', 0);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log(scoreboard);
  return scoreboard;
};

export const isGameOver = async (gameID: string) => {
  await client.hIncrBy(gameID, 'Current_Question', 1);
  const quiz = await client.hGetAll(gameID);
  if (quiz.Current_Question === quiz.No_Questions) return true;
  return false;
};

const tester = async (gameID:string) => {
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log(scoreboard);
};
tester('GIBM')

export default { addPlayerToScoreboard, updateScoreboard, renderScoreboard };

// renderScoreboard('GIBM')