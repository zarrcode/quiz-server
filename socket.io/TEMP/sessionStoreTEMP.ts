// TODO: replace with Redis store

import { v4 as uuidv4 } from 'uuid';

interface Session {
  username: string,
  sessionID: string,
  gameID?: string,
}

const sessionStore: Session[] = [];

export function createSession(username: string) {
  const sessionID = uuidv4();
  const session = {
    username,
    sessionID,
  };
  sessionStore.push(session);
  return sessionID;
}

export function findSession(sessionID: string) {
  return sessionStore.find((session) => session.sessionID === sessionID);
}

export function destroySession(sessionID: string) {
  sessionStore.filter((session) => session.sessionID !== sessionID);
}

export function addGameIDToSession(sessionID: string, gameID: string) {
  sessionStore.forEach((session) => {
    // eslint-disable-next-line no-param-reassign
    if (session.sessionID === sessionID) session.gameID = gameID;
  });
}

export default {
  createSession,
  findSession,
  destroySession,
  addGameIDToSession,
};
