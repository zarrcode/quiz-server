import client from '../db'

export const addPlayerToScoreboard = async (gameID:string, username:string) => {

  //once receives confirmation, send scoreboard
  await client.hSet(gameID+'Scoreboard', username, 0)
  const scoreboard = await client.hGetAll(gameID+'Scoreboard')
  console.log(scoreboard)

}

export const updateScoreboard = async (gameID:string, username:string) => {

//increments user score by 1
  await client.hIncrBy(gameID+'Scoreboard', username, 1)
  const scoreboard = await client.hGetAll(gameID+'Scoreboard')
  console.log(scoreboard)

}


export const renderScoreboard = async (gameID:string) => {

  //move currentquestion in db up by 1;
  await client.hIncrBy(gameID, 'Current_Question', 1)

  const scoreboard = await client.hGetAll(gameID+'Scoreboard')
  console.log(scoreboard)
  return scoreboard;

}


// export default { addPlayerToScoreboard, updateScoreboard, renderScoreboard }