import client from '../db'
import { v4 as uuid } from 'uuid';
// import getQuestions from '../controllers/questions/index'


const createSession = async (username: string) => {

  const userID = uuid();
  const values = {'username': username}
  await client.hSet(userID, values)

  const result = {
    userID,
    username,
    gameID: null
  }
  console.log(result)
  return result
}


const registerHost = async (username: string, gameID: string) => {
  const hostID = uuid()
  const values = {'username': username, 'gameID': gameID}
  await client.hSet(hostID, values)
  return hostID
}


const registerPlayer = async (quizCode: string, username: string) => {

  //check quiz exists
  const check = await client.hGetAll(quizCode)
  if (!check) console.log('Quiz does not exist');
  //create player hash with quiz, and unique userID
  //check if they are final user to join
  //make sure you increase active game players
}


const addPlayerToGameList = async (gameID: string, userID: string) => {
  const savedList = await client.lPush(gameID+'PlayerList', userID)
  console.log(savedList)
}


const userDisconnects = async() => {

}

const userReconnects = async() => {

}



export default registerHost