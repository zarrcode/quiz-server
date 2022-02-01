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


const getSession = async (userID: string) => {

}

const registerHost = async (username: string, userID: string, gameID: string) => {
  const values = {'username': username, 'gameID': gameID}
  await client.hSet(userID, values)
}


const registerPlayer = async (quizCode: string, username: string) => {

  //check quiz exists
  const check = await client.hGetAll(quizCode)
  if (!check) console.log('Quiz does not exist');

  //create player hash with quiz, and unique userID



  //check if they are final user to join


}



export default registerHost