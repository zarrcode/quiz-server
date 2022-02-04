import client from '../db';

export const addPlayerToScoreboard = async (gameID: string, username: string) => {
  await client.hSet(`${gameID}Scoreboard`, username, 0);
  const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
  return scoreboard;
};

// need to be prepared if this gets passed as an array
export const updateScoreboard = async (gameID:string, username: string | string[]) => {
  if (Array.isArray(username)) {
    username.map((el) => client.hIncrBy(`${gameID}Scoreboard`, el, 1));
  } else {
    client.hIncrBy(`${gameID}Scoreboard`, username, 1);
  }
};

interface Score { [key: string]: string }

export const renderScoreboard = async (gameID:string) => {
  try {
    await client.hIncrBy(gameID, 'Current_Question', 1);
    await client.hSet(gameID, 'Submitted_Answers', 0);
    const scoreboard = await client.hGetAll(`${gameID}Scoreboard`);
    if (scoreboard) {
      const orderedScoreboard: any = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(scoreboard)) {
        const score: Score = {};
        score.username = key;
        score.score = value;
        orderedScoreboard.push(score);
      }
      orderedScoreboard.sort((a: Score, b:Score) => Number(b.score) - Number(a.score));
      return orderedScoreboard;
    }
    console.log('scoreboard not rendering');
    return undefined;
  } catch (err) {
    return err;
  }
};

export const isGameOver = async (gameID: string) => {
  await client.hIncrBy(gameID, 'Current_Question', 1);
  const quiz = await client.hGetAll(gameID);
  if (quiz.Current_Question === quiz.No_Questions) return true;
  return false;
};

export default { addPlayerToScoreboard, updateScoreboard, renderScoreboard };
