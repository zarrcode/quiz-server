import client from '../db';

export const addPlayerToScoreboard = async (gameID: string, username: string) => {
  // once receives confirmation, send scoreboard
  await client.hSet(`${gameID}Scoreboard`, username, 0);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log(scoreboard);
};

// need to be prepared if this gets passed as an array
export const updateScoreboard = async (gameID:string, username: string) => {
  // increments user score by 1
  await client.hIncrBy(`${gameID}Scoreboard`, username, 1);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log(scoreboard);
};

export const renderScoreboard = async (gameID:string) => {
  await client.hIncrBy(gameID, 'Current_Question', 1);
  await client.hSet(gameID, 'Submitted_Answers', 0);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  console.log(scoreboard);
  return scoreboard;
};

export default { addPlayerToScoreboard, updateScoreboard, renderScoreboard };
